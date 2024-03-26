import { Chat } from "../models/Chat.js";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";

// Mapeo de ID de usuario a ID de socket
const userSocketMap = new Map();

export function chat(socket) {
	// Manejar la conexión de un nuevo usuario
	socket.on("authenticated", ({ token }) => {
		console.log("User connected:", socket.id);
		// console.log(token);

		async function updateSocketInDataBase(userId, userType, socketId) {
			// Aquí implementa la lógica para actualizar la columna socket_id en la base de datos.
			// Puedes utilizar Sequelize o cualquier ORM que estés usando.
			try {
				console.log(userType);
				if (userType === "client") {
					await Client.update(
						{ socket_id: socketId },
						{ where: { id: userId } }
					);
				} else if (userType === "service") {
					await Service.update(
						{ socket_id: socketId },
						{ where: { id: userId } }
					);
				}
				console.log("user register in data base");
			} catch (error) {
				console.log(error);
			}
		}

		// Actualizar el socket.id en la base de datos cuando un usuario se conecta
		updateSocketInDataBase(token.id, token.type, socket.id);
	});

	socket.on("chat", async (bodyReceived) => {
		// console.log(bodyReceived);

		let from = null;
		let receiver = null;
		if (bodyReceived.from.type === "service") {
			from = await Service.findByPk(bodyReceived.from.id);
		} else {
			from = await Client.findByPk(bodyReceived.from.id);
		}

		if (bodyReceived.to.type === "client") {
			receiver = await Client.findByPk(bodyReceived.to.id);
		} else {
			receiver = await Service.findByPk(bodyReceived.to.id);
		}

		try {
			let body = {
				id_receiver: receiver.id,
				id_sender: from.id,
				sender_type: bodyReceived.from.type,
				receiver_type: bodyReceived.to.type,
				message: bodyReceived.message,
				date: new Date(),
			};
			console.log(body);
			Chat.create(body);
		} catch (error) {
			console.log(error);
		}

		// Obtener el ID de socket del receptor desde el mapeo
		console.log(receiver.socket_id);
		try {
			socket.to(receiver.socket_id).emit("chat", {
				message: bodyReceived.message,
				from: `${receiver.name} ${receiver.last_name}`,
				sender: {
					id: bodyReceived.id_sender,
					name: from.name,
					lastName: from.last_name,
					type: bodyReceived.sender_type,
					image: `http://localhost:3000/uploads/${from.image}`,
				},
				receiver: {
					id: bodyReceived.id_receiver,
					name: receiver.name,
					lastName: receiver.last_name,
					type: bodyReceived.receiver_type,
					image: `http://localhost:3000/uploads/${receiver.image}`,
				},
			});
		} catch (error) {
			console.log(error);
		}

		socket.on("disconnect", () => {
			console.log(`User  disconnected`);
		});
	});
}
