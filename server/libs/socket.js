import { Chat } from "../models/Chat.js";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";
import { Order } from "../models/Order.js";

let onlineUser = [];

export function chat(socket, io) {
	// Handling the connection of a new user

	socket.on("authenticated", async (token) => {
		console.log("User connected:", socket.id);

		const existingUserIndex = onlineUser.findIndex(
			(user) => user.id === token.id && user.type === token.type
		);

		if (existingUserIndex !== -1) {
			// If the user already exists, update their socket ID
			onlineUser[existingUserIndex].socketId = socket.id;
			console.log("Usuario actualizado:", onlineUser[existingUserIndex]);
		} else {
			onlineUser.push({
				...token,
				socketId: socket.id,
			});
			console.log(
				"Usuario agregado:",
				onlineUser[onlineUser.length - 1].socketId
			);
		}

		async function updateSocketInDataBase(userId, userType, socketId) {
			try {
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

		// Update the socket.id in the database when a user connects
		updateSocketInDataBase(token.id, token.type, socket.id);
	});
	socket.on("chat", async ({ message }) => {
		let from = null;
		let receiver = null;
		if (message.from.type === "service") {
			from = await Service.findByPk(message.from.id);
		} else {
			from = await Client.findByPk(message.from.id);
		}

		if (message.to.type === "client") {
			receiver = await Client.findByPk(message.to.id);
		} else {
			receiver = await Service.findByPk(message.to.id);
		}

		try {
			let body = {
				id_receiver: receiver.id,
				id_sender: from.id,
				sender_type: message.from.type,
				receiver_type: message.to.type,
				message: message.message,
				date: new Date(),
			};
			Chat.create(body);
		} catch (error) {
			console.log(error);
		}

		try {
			// send in real time
			function sendRealTime(to) {
				io.to(user.socketId).emit("getMessage", {
					message: message.message,
					from: `${receiver.name} ${receiver.last_name}`,
					sender: {
						id: from.id,
						name: from.name,
						lastName: from.last_name,
						type: message.from.type,
						image: `http://localhost:3000/uploads/${from.image}`,
					},
					receiver: {
						id: receiver.id,
						name: receiver.name,
						lastName: receiver.last_name,
						type: message.to.type,
						image: `http://localhost:3000/uploads/${receiver.image}`,
					},
				});
			}

			const user = onlineUser.find((user) => user.email === message.to.email);
			if (user) {
				sendRealTime(user.socketId);
			}
		} catch (error) {
			console.log(error);
		}
	});

	//handling for orders change

	socket.on("changeOrder", async ({ data }) => {
		try {
			await Order.update(
				{
					status: data.status,
				},
				{
					where: {
						id: data.id,
					},
				}
			);

			socket.emit("changeOrderDone", "successful");
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("doneOrder", async ({ data }) => {
		try {
			await Order.update(
				{
					status: "Realizada",
				},
				{
					where: {
						id: data.id,
					},
				}
			);

			socket.emit("changeOrderDone", "successful");
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("notification", async (data) => {
		try {
			let res = await Service.findByPk(data.id);

			io.to(res.socket_id).emit("notification", "newOrder");
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("disconnect", () => {
		console.log(`User  disconnected`);
		onlineUser = onlineUser.filter((user) => user.socketId !== socket.id);
	});
}
