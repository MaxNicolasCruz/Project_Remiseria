import { Link } from "react-router-dom";
import { getAllServiceRequest } from "../api/auth";
import CardService from "../components/ui/CardService";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

function Home({ search }) {
	const [slideOn, setSlideOn] = useState(false);
	const [users, setUsers] = useState([]);
	const [autheticated, setAutheticated] = useState(null);
	const [Loading, setLoading] = useState(false);
	const [notification, setNotification] = useState(null);
	const { isAutheticated, user } = useAuth();
	const { socket } = useChat(user);
	const [usersFilter, setUsersFilter] = useState([]);

	function openSlide() {
		setSlideOn(!slideOn);
	}
	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		try {
			let res = await getAllServiceRequest();

			setUsers(res.data.data);
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		setLoading(true);
	}, [user]);

	useEffect(() => {
		setAutheticated(isAutheticated);
	}, [isAutheticated]);

	useEffect(() => {
		if (socket === null) return;
		socket.on("notification", async (data) => {
			setNotification(true);
		});

		return () => {
			socket.off("notification");
		};
	}, [socket]);

	function searchUser(string) {
		let userSearch = users.filter((user) => {
			let name = `${user.name} ${user.lastName}`;

			return name.toLowerCase().includes(search.toLowerCase());
		});
		setUsers(userSearch);
	}
	useEffect(() => {
		if (search.length === 0) return;
		searchUser(search);
		if (search === "RATING") {
			let usersByRating = users
				.filter((user) => user.rating !== undefined)
				.sort((a, b) => b.rating - a.rating);
			setUsers(usersByRating);
		}
	}, [search]);

	return (
		<>
			{Loading ? (
				<main className="mt-4 ">
					<div className="flex flex-col justify-center text-center lg:flex-row lg:max-w-none">
						<div>
							<button
								className="focus:ring-1 focus:ring-black rounded lg:hidden bg-gray-400"
								onClick={openSlide}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 text-white"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
									/>
								</svg>
							</button>
							<div
								className={
									slideOn
										? "slideMenu lg:transition-5ms lg:top-[0px] lg:z-10 lg:relative lg:h-[410px]"
										: "slideMenu transition-5ms top-[0px] z-10 relative"
								}
							>
								{isAutheticated ? (
									<>
										<h2 className="cursor-default">Menu</h2>
										<div className="hidden w-28 h-28 ml-auto mr-auto lg:block">
											<img
												src={user ? user.image : "undefined"}
												alt="goku"
												className="w-full h-full rounded-full"
											/>
										</div>
										<ul className="flex flex-col justify-around cursor-default">
											<li>
												<Link to={"/profile"}>View Profile</Link>
											</li>
											<li>
												<Link to={"/"}>Explore Categories</Link>
											</li>
											<li>
												<Link to={"/chats"}>Chat</Link>
											</li>
											<li className=" flex justify-center items-center">
												<Link to={"/order"}>My Orders</Link>
												{notification && (
													<div className="w-2 h-2 ml-1 bg-red-500 rounded-full animate-bounce animate-infinite animate-duration-1000 animate-delay-0"></div>
												)}
											</li>
										</ul>
									</>
								) : (
									<>
										<h2 className="font-bold">Log in to see</h2>
										<div className="flex justify-center">
											<Link to={"/login"}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-7 h-7"
												>
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
													/>
												</svg>
											</Link>
										</div>
									</>
								)}
							</div>
						</div>
						<div className="grid gap-1 grid-cols-1 smm sm:grid-cols-3 lg:grid-cols-4 lg:w-[70%]">
							{users?.map((user, i) => {
								return <CardService key={i} user={user}></CardService>;
							})}
						</div>
					</div>
				</main>
			) : (
				<>
					<p>cargando...</p>
				</>
			)}
		</>
	);
}

export default Home;
