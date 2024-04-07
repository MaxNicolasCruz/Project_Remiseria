import React, { useEffect, useState } from "react";
import { getUserService } from "../api/auth";
import { useParams } from "react-router-dom";
import CardInfo from "../components/viewUser/CardInfo";
import CardReview from "../components/viewUser/CardReview";
import CardHistory from "../components/viewUser/CardHistory";
import { FaCar } from "react-icons/fa";
import { IoCall, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Chat from "../components/ui/Chat";
import { useAuth } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";

function User() {
	const { user: client } = useAuth();
	const [user, setUser] = useState(null);
	const { id } = useParams();
	const [typeAccount, setTypeAccount] = useState(false);
	const [typeInfo, setInfo] = useState("info");
	const [status, setStatus] = useState(false);
	const [chat, setChat] = useState(false);

	useEffect(() => {
		if (client) {
			setTypeAccount(Object.keys(client).length > 11 ? "service" : "client");
		}
	}, [client]);

	useEffect(() => {
		async function getUser() {
			try {
				const res = await getUserService(id);
				const dateOfBirth = new Date(res.data.data.formattedUser.dateOfBirth);
				const age = new Date().getFullYear() - dateOfBirth.getFullYear();
				res.data.data.formattedUser.dateOfBirth = age;
				setUser(res.data.data.formattedUser);
			} catch (error) {
				console.log(error);
			}
		}
		getUser();
	}, []);
	useEffect(() => {
		if (user) {
			let newClass = "";

			switch (user.state) {
				case "En servicio":
					newClass = { bg: "bg-green-400", text: "text-green-400" };
					break;
				case "Fuera de Servicio":
					newClass = { bg: "bg-red-600", text: "text-red-500" };
					break;
				case "En Pedido":
					newClass = { bg: "bg-orange-500", text: "text-orange-500" };
					break;
				default:
					break;
			}

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
										<FaCar fontSize={22} className="cursor-pointer " />
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
								<FaCar />
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
				</>
			) : (
				<p>Loading...</p>
			)}
		</main>
	);
}

export default User;
