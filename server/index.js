import app from "./app.js";
import { sequelize } from "./database/database.js";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { chat } from "./libs/socket.js";

const server = http.createServer(app);
const io = new SocketServer(server, {
	cors: {
		origin: "http://localhost:5173",
	},
	reconnection: true, // Enable automatic reconnection
	reconnectionAttempts: 10, // Maximum number of reconnection attempts
	reconnectionDelay: 1000, // Initial delay between reconnection attempts (in milliseconds)
});

io.on("connection", (socket) => {
	chat(socket, io); // Pass the connected socket IDs to the chat module
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
