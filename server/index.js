import app from "./app.js";
import { sequelize } from "./database/database.js";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { chat } from "./libs/socket.js";
// import socketioAuth from "socketio-auth";

const server = http.createServer(app);
const io = new SocketServer(server, {
	cors: {
		origin: "http://localhost:5173",
	},
});

// socketioAuth(io, {
// 	authenticate: async (socket, data, callback) => {
// 		// Aquí puedes realizar la autenticación basada en el token o cualquier otro método que elijas
// 		console.log(data.token);
// 		const token = data.token; // Asume que el token se pasa como parte de los datos

// 		// Realiza la autenticación según tu lógica y llama al callback con el resultado
// 		const isAuthenticated = await authenticateUser(token);

// 		if (isAuthenticated) {
// 			return callback(null, true);
// 		} else {
// 			return callback(new Error("Authentication failed"));
// 		}
// 	},
// });

io.on("connection", (socket, req, res) => {
	chat(socket);
});
async function main() {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");

		server.listen("3000");
		console.log(`sevidor on port `, 3000);
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
}
main();
