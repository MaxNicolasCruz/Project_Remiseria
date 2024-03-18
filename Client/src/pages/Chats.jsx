import React, { useEffect, useState } from "react";

import { getChatClient, getChatService } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import Chat from "../components/ui/Chat";

function Chats() {
	const { user: client } = useAuth();
	const [typeAccount, setTypeAccount] = useState(false);
	const [dataClient, setDataClient] = useState(null);
	const [chats, setChats] = useState([]);
	const [showChat, setShowChat] = useState(false);

	useEffect(() => {
		if (client) {
			setTypeAccount(Object.keys(client).length > 11 ? "service" : "client");
			setDataClient(client);
			// console.log(client);
		}
	}, [client]);
	// console.log(chats);
	useEffect(() => {
		let res = [];
		async function getChat() {
			try {
				if (typeAccount == "service") {
					res = await getChatService();
					setChats(res.data.data);
					return;
				} else if (typeAccount == "client") {
					res = await getChatClient();
					setChats(res.data.data);
					return;
				}
			} catch (error) {
				console.error("Error fetching chats:", error);
			}
		}
		if (Object.keys(client).length > 0) {
			getChat();
		}
	}, [typeAccount, client]);

	return (
		<div className="flex flex-col min-h-screen gradiante-bg">
			<section className=" py-5 px-2 flex flex-col items-center mb-3">
				{Object.keys(chats).map((chatKey) => (
					<>
						<div
							key={chatKey}
							className="my-2 bg-yellowPrimary rounded-lg p-2 flex justify-between items-center h-1/5 max-h-[70px] max-w-[310px] w-full border-[3px] border-white lg:max-w-[600px] lg:mb-4 cursor-pointer transform lg:hover:-translate-y-2 lg:hover:bg-gray-500 lg:hover:text-white lg:hover:font-semibold lg:hover:text-lg transition-all "
							onClick={() => setShowChat(chatKey)}
						>
							<h3>
								{chats[chatKey][0]?.sender?.id == client.id &&
								chats[chatKey][0]?.sender?.type == typeAccount
									? chats[chatKey][0]?.receiver?.name
									: chats[chatKey][0]?.sender?.name}
							</h3>
							<div className="w-1/6 max-w-[40px]">
								<img
									src={
										chats[chatKey][0]?.sender?.id == client.id &&
										chats[chatKey][0]?.sender?.type == typeAccount
											? chats[chatKey][0]?.receiver?.image
											: chats[chatKey][0]?.sender?.image
									}
									alt="imagen del usuario"
									className="rounded-full"
								/>
							</div>
						</div>
						{showChat === chatKey && (
							<Chat
								user={
									chats[chatKey][0]?.sender?.id == client.id &&
									chats[chatKey][0]?.sender?.type == typeAccount
										? chats[chatKey][0]?.receiver
										: chats[chatKey][0]?.sender
								}
								chat={chats[chatKey]}
								typeAccount={typeAccount}
							/>
						)}
					</>
				))}
			</section>
		</div>
	);
}

export default Chats;
