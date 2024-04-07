import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { useAuth } from "./AuthContext";

export const ChatContext = createContext();

export const useChat = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const ChatContextProvider = ({ children, user }) => {
	const { isAutheticated } = useAuth();
	const [isSserChatLoading, setIsSserChatLoading] = useState(false);
	const [userChatError, setUserChatError] = useState(null);
	const [newMessage, setNewMessage] = useState([]);
	// const [to, setTo] = useState(false);

	const [typeAccount, setTypeAccount] = useState(false);

	const [socket, setSocket] = useState(null);

	// initial socket

	useEffect(() => {
		if (user) {
			setTypeAccount(Object.keys(user).length > 11 ? "service" : "client");
		}
	}, [user]);

	useEffect(() => {
		if (!user) return;

		setTypeAccount(Object.keys(user).length > 11 ? "service" : "client");

		const cookies = Cookies.get();

		// Configurar Socket.io para la reconexión automática
		const newSocket = io("http://localhost:3000", {
			reconnection: true,
			reconnectionAttempts: 10,
			reconnectionDelay: 10000,
			auth: {
				token: cookies.token, // Token JWT del usuario autenticado
			},
		});

		// Establecer el nuevo socket
		setSocket(newSocket);

		// Limpiar el socket al desmontar el componente
		return () => {
			console.log("disconect");
			newSocket.disconnect();
		};
	}, [user]);

	const sendMessage = (message, to) => {
		//send message

		if (socket === null) return;
		socket.emit("chat", { message });
	};

	const receiverMessage = () => {
		// receiver Message

		useEffect(() => {
			if (socket === null) return;

			socket.on("getMessage", (res) => {
				setNewMessage((prev) => [...prev, res]);
			});

			return () => {
				socket.off("getMessage");
			};
		}, []);
	};

	const newUserOnline = (socket) => {
		if (!socket) return;

		socket.on("connect", () => {
			if (user && socket.id) {
				socket.emit("authenticated", {
					id: user.id,
					email: user.email,
					type: typeAccount,
					socketId: socket.id,
				});
			}
		});

		socket.on("disconnect", () => {
			console.log("Desconectado del servidor");
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
		};
	};

	useEffect(() => {
		newUserOnline(socket);
	}, [socket, user, typeAccount]);

	return (
		<ChatContext.Provider
			value={{
				user,
				isSserChatLoading,
				userChatError,
				sendMessage,
				receiverMessage,
				newUserOnline,
				socket,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
