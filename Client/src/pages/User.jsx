import React, { useEffect, useState } from "react";
import { getUserService, sendOrder } from "../api/auth";
import { useParams } from "react-router-dom";
import CardInfo from "../components/viewUser/CardInfo";
import CardReview from "../components/viewUser/CardReview";
import CardHistory from "../components/viewUser/CardHistory";
import { FaCar } from "react-icons/fa";
import { IoCall, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Chat from "../components/ui/Chat";
import { useAuth } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import Alert from "../components/ui/alert";
import { useChat } from "../context/ChatContext";
import { differenceInYears } from "date-fns";

function User() {
	const { user: client } = useAuth();
	const [user, setUser] = useState(null);
	const { id } = useParams();
	const [typeAccount, setTypeAccount] = useState(false);
	const [typeInfo, setInfo] = useState("info");
	const [status, setStatus] = useState(false);
	const [state, setState] = useState(false);
	const [chat, setChat] = useState(false);
	const [calling, setCalling] = useState(false);
	const { socket } = useChat(user);

	useEffect(() => {
		if (client) {
			setTypeAccount(Object.keys(client).length > 11 ? "service" : "client");
		}
	}, [client]);

	useEffect(() => {
		async function getUser() {
			try {
				const res = await getUserService(id);
				res.data.data.formattedUser.dateOfBirth = differenceInYears(
					new Date(),
					new Date(res.data.data.formattedUser.dateOfBirth)
				);
				setUser(res.data.data.formattedUser);
			} catch (error) {
				console.log(error);
			}
		}
		getUser();
	}, []);

	function askForOrder() {
		if (user.state == "En servicio" || user.state == "En Pedido") {
			let data = { typeAccount: typeAccount, id: user.id };
			try {
				sendOrder(data);
				socket.emit("notification", { id: user.id, typeAccount: "Service" });
			} catch (error) {
				setState("hubo errores en el envio, intentelo mas tarde");

				setStatus({ bg: "bg-red-600", text: "text-red-500" });
				console.log(error);
			}
		}

		setCalling(true);

		const timer = setTimeout(() => {
			setCalling(false);
		}, 5000);
		return () => clearTimeout(timer);
	}

	useEffect(() => {
		if (user) {
			let newClass = "";
			let newState = "";
			switch (user.state) {
				case "En servicio":
					newClass = { bg: "bg-green-400", text: "text-green-400" };
					newState = "Su pedido esta siendo recibido por favor espere";

					break;
				case "Fuera de Servicio":
					newClass = { bg: "bg-red-600", text: "text-red-500" };
					newState = "El servicio no esta disponible";
					break;
				case "En Pedido":
					newClass = { bg: "bg-orange-500", text: "text-orange-500" };
					newState = "El servicio Esta ocupado pero fue enviada su podido";

					break;
				default:
					break;
			}

			setState(newState);

			setStatus(newClass);
		}
	}, [user]);

	return (
		<main className="py-4 bg-[#ebebeb] ">
			{user ? (
				<>
					<section className="lg:flex lg:items-center lg:justify-center cursor-default">
						<div className="flex flex-col items-center lg:flex-row lg:w-2/5 lg:justify-center ">
							<div className="w-3/6 h-full flex justify-center ">
								<Avatar
									alt="Image User"
									src={user.image}
									sx={{ width: 156, height: 156 }}
									className="m-auto"
								/>
							</div>
							<div className="flex flex-col items-center lg:items-start pl-2 ">
								<h2 className="text-lg ">
									{`${user.name} ${user.lastName}`}{" "}
									<span
										className={`w-3 h-3 rounded-full inline-flex ${status.bg} lg:hidden`}
									></span>
								</h2>
								<p className="text-sm">{typeAccount ? "Driver" : "User"}</p>
							</div>
						</div>
						<div className="font-bold flex justify-around pt-2 text-center sm:justify-evenly lg:w-3/12 lg:flex-col lg:items-center">
							<div className="flex justify-around w-3/4 lg:pb-9">
								<div>
									<h2 className="text-xl ">{user.orders.length}</h2>
									<p className="text-sm">Orders</p>
								</div>
								<div>
									<h2 className="text-xl ">{user.rating || 0}</h2>
									<p className="text-sm">Rating</p>
								</div>
								<div>
									<h2 className="text-xl ">{user.dateOfBirth}</h2>
									<p className="text-sm">Years</p>
								</div>
							</div>
							<div className="hidden lg:flex lg:h-7 lg:justify-center items-center w-3/4">
								<div className="flex justify-around px-5 sm:justify-evenly lg:w-full lg:justify-between ">
									<div className="bg-yellowPrimary scale-150 rounded-full p-1 hover:bg-[#5d5e5c] hover:text-white transition">
										<IoChatbubbleEllipsesOutline
											fontSize={22}
											className="cursor-pointer "
											onClick={() => setChat(!chat)}
										/>
									</div>
									<div className="bg-yellowPrimary scale-150 rounded-full p-1 hover:bg-[#5d5e5c] hover:text-white transition">
										<IoCall fontSize={22} className="cursor-pointer " />
									</div>
									<div className="bg-yellowPrimary scale-150 rounded-full p-1 hover:bg-[#5d5e5c] hover:text-white transition">
										<FaCar
											fontSize={22}
											className="cursor-pointer "
											onClick={() => {
												askForOrder();
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className=" px-5 py-4 relative max-w-[600px] mx-auto lg:max-w-none lg:w-3/5">
						<nav className="flex justify-around text-xs text-center font-bold relative z-0 sm:justify-start">
							<div
								className={`nav-info-user  ${
									typeInfo == "info"
										? `translate-y-[6px] rounded-xl pt-1  `
										: `translate-y-[15px] rounded-3xl hover:bg-gray-600 hover:text-white hover:translate-y-[6px] hover:pt-1`
								}  `}
								onClick={() => {
									setInfo("info");
								}}
							>
								Info
							</div>
							<div
								className={`nav-info-user  ${
									typeInfo == "review"
										? `translate-y-[6px] rounded-xl pt-1  `
										: `translate-y-[15px] rounded-3xl hover:bg-gray-600 hover:text-white hover:translate-y-[6px] hover:pt-1`
								}  `}
								onClick={() => {
									setInfo("review");
								}}
							>
								Review
							</div>
							<div
								className={`nav-info-user  ${
									typeInfo == "history"
										? `translate-y-[6px] rounded-xl pt-1  `
										: `translate-y-[15px] rounded-3xl hover:bg-gray-600 hover:text-white hover:translate-y-[6px] hover:pt-1`
								}  `}
								onClick={() => {
									setInfo("history");
								}}
							>
								History
							</div>
						</nav>
						{typeInfo == "info" && <CardInfo user={user} status={status} />}
						{typeInfo == "review" && <CardReview user={user} />}
						{typeInfo == "history" && <CardHistory user={user} />}
					</section>
					<section>
						<div className="flex justify-around px-5 sm:justify-evenly lg:hidden">
							<div className="bg-yellowPrimary scale-150 rounded-full p-1">
								<IoChatbubbleEllipsesOutline onClick={() => setChat(!chat)} />
							</div>
							<div className="bg-yellowPrimary scale-150 rounded-full p-1">
								<IoCall />
							</div>
							<div className="bg-yellowPrimary scale-150 rounded-full p-1">
								<FaCar
									onClick={() => {
										askForOrder();
									}}
								/>
							</div>
						</div>
					</section>
					{chat && (
						<>
							<Chat
								user={{ ...user, type: "service" }}
								typeAccount={typeAccount}
							></Chat>
						</>
					)}
					{calling && <Alert message={state} color={status.bg} />}
				</>
			) : (
				<p>Loading...</p>
			)}
		</main>
	);
}

export default User;
