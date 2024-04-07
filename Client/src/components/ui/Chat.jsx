import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowDropupCircle } from "react-icons/io";
import { BsSend } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import Message from "./Message";
import { ChatContextProvider, useChat } from "../../context/ChatContext";

function Chat({ user, chat, typeAccount }) {
	const { user: client } = useAuth();
	const { sendMessage, receiverMessage, newUserOnline, socket } =
		useChat(client);
	const messagesEndRef = useRef(null);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const [dataClient, setDataClient] = useState(null);
	const [hidden, setHidden] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		let newMessage = {
			message: message,
			from: { name: "me", image: client.image },
			to: { name: user.name, image: user.image },
		};
		setMessages([...messages, newMessage]);

		newUserOnline(socket);

		sendMessage({
			message: message,
			from: {
				id: client.id,
				type: typeAccount,
				email: client.email,
				socketId: socket.id,
			},
			to: {
				id: user.id,
				type: user.type,
				email: user.email,
			},
		});

		setMessage("");
	};

	useEffect(() => {
		setMessages([]);
		if (chat) {
			chat.forEach((message) => {
				receiveMessage(message);
			});
		}
	}, [chat, typeAccount]);

	useEffect(() => {
		setDataClient(client);
	}, [client]);

	useEffect(() => {
		const messagesContainer = messagesEndRef.current;
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		if (!user) return;
		if (socket === null) return;
		socket.on("getMessage", (message) => {
			let isBelongChat =
				(message.sender.id === user.id && message.sender.type === user.type) ||
				(message.receiver.id === user.id &&
					message.receiver.type === user.type);

			if (isBelongChat) {
				receiveMessage(message);
			}
		});
		return () => {
			socket.off("getMessage");
		};
	}, [socket]);

	const receiveMessage = (newMessage) => {
		let isSender =
			client.id === newMessage.sender.id &&
			newMessage.sender.type === typeAccount;

		//Aqui haz tu
		setMessages((prevMessages) => [
			...prevMessages,
			{
				id: newMessage.id,
				message: newMessage.message,
				from: {
					name: isSender ? "me" : newMessage.sender.name,
					image: isSender ? newMessage.sender.image : newMessage.receiver.image,
				},
				to: { name: user.name, image: user.image },
			},
		]);
	};

	return (
		<div
			className={`fixed right-0 bottom-0 z-50 h-2/3 w-full px-5 max-w-[300px] sm:right-6 ${
				hidden ? " top-[91%]  " : " bottom-9 top-[25%] transition-5ms"
			}`}
		>
			<section
				className={`bg-yellowPrimary flex justify-between h-[10%] min-h-[30px] rounded-t items-center ${
					hidden && " rounded-b"
				}`}
			>
				<h2 className="font-semibold pl-2">{`${user?.name} ${user?.lastName}`}</h2>
				<span
					onClick={() => setHidden(!hidden)}
					className="pr-2 text-xl text-gray-500"
				>
					<IoMdArrowDropupCircle
						className={`lg:hover:text-gray-400 lg:hover:scale-150 transition-all cursor-pointer ${
							!hidden ? "rotate-180 transition-all" : "transition-all"
						} `}
					/>
				</span>
			</section>
			<section
				className={`h-full bg-gray-500 flex flex-col justify-between relative rounded-b-md  ${
					hidden ? "hidden transition-5ms" : " transition-5ms"
				}`}
			>
				<div
					className="flex flex-col overflow-y-auto max-h-[80%] mb-12"
					style={{
						scrollbarColor: "rgb(77 77 74) rgb(0 0 0 / 0%)",
						scrollbarGutter: "auto",
						scrollbarWidth: "thin",
					}}
					ref={messagesEndRef}
				>
					{messages.map((messageSingle, i) => (
						<div key={i}>
							<Message message={messageSingle} user={user} />
						</div>
					))}
				</div>
				<div className={`flex justify-center`}>
					<form
						onSubmit={handleSubmit}
						className="text-black bg-gray-300 rounded-2xl h-[10%] min-h-[30px]  w-[90%] my-2 flex mx-auto absolute bottom-0  justify-around "
					>
						<input
							type="text"
							placeholder="Write"
							className="bg-transparent outline-none pl-1"
							onChange={(e) => setMessage(e.target.value)}
							value={message}
						/>
						<button className="-ml-4">
							<BsSend />
						</button>
					</form>
				</div>
			</section>
		</div>
	);
}

export default Chat;
