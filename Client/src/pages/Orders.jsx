import React, { useEffect, useState } from "react";
import { FaCircleArrowDown } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { getOrderClient, getOrderService } from "../api/auth";
import ListOrder from "../components/ui/ListOrder";
import { useChat } from "../context/ChatContext";
import FormReview from "../components/ui/FormReview";
import TextField from "../components/ui/TextField";

function Orders() {
	const { user } = useAuth();

	const { socket } = useChat(user);
	const [pending, setPending] = useState(false);
	const [waiting, setWaiting] = useState(false);
	const [agreed, setAgreed] = useState(false);
	const [rejected, setRejected] = useState(false);
	const [done, setDone] = useState(false);
	const [typeAccount, setTypeAccount] = useState(null);
	const [order, setOrder] = useState(null);
	const [review, setReview] = useState(false);

	useEffect(() => {
		if (user) {
			setTypeAccount(Object.keys(user).length > 11 ? "service" : "client");
		}
	}, [user]);

	async function getOrders() {
		let res;
		if (typeAccount === "service") {
			res = await getOrderService();
		} else if (typeAccount === "client") {
			res = await getOrderClient();
		}
		if (res) setOrder(res.data.data);
	}

	useEffect(() => {
		getOrders();
	}, [typeAccount]);

	useEffect(() => {
		if (socket === null) return;

		socket.on("changeOrderDone", async (data) => {
			if (data === "successful") {
				let res;
				if (typeAccount === "service") {
					res = await getOrderService();
				} else if (typeAccount === "client") {
					res = await getOrderClient();
				}
				if (res) setOrder(res.data.data);
			}
		});

		return () => {
			socket.off("changeOrderDone");
		};
	}, [typeAccount]);

	function changeOrder(data) {
		socket.emit("changeOrder", { data });
	}

	function doneOrder(data) {
		socket.emit("doneOrder", { data });
	}

	return (
		<div className="flex flex-col min-h-screen gradiante-bg ">
			{user ? (
				<>
					<div className="order-list ">
						<p>Pending</p>
						<FaCircleArrowDown
							className={`transition-all ml-2 cursor-pointer lg:hover:scale-125 lg:hover:text-yellowPrimary  ${
								pending && "rotate-180"
							}`}
							onClick={() => {
								if (pending) {
									setPending("animation");
									const timer = setTimeout(() => {
										setPending(false);
									}, 500);
									return () => clearTimeout(timer);
								}
								setPending(true);
							}}
						/>
					</div>
					{pending &&
						order.pending.length > 0 &&
						order.pending.map((orderPending, i) => {
							return (
								<>
									<ListOrder
										order={orderPending}
										key={i}
										user={user}
										done={pending}
									>
										<div className="flex flex-col items-center sm:flex-row sm:justify-center">
											{typeAccount === "service" ? (
												<>
													<button
														className="btn scale-75 bg-green-500 sm:hover:scale-90"
														onClick={() =>
															changeOrder({
																id: orderPending.id,
																status: "Aceptada",
															})
														}
													>
														Agreed
													</button>
													<button
														className="btn scale-75 bg-red-400  sm:hover:scale-90"
														onClick={() =>
															changeOrder({
																id: orderPending.id,
																status: "Rechazada",
															})
														}
													>
														Reject
													</button>
													<button
														className="btn scale-75 bg-orange-400  sm:hover:scale-90"
														onClick={() =>
															changeOrder({
																id: orderPending.id,
																status: "En espera",
															})
														}
													>
														Wait
													</button>
												</>
											) : (
												<>
													<button
														className="btn scale-75 bg-red-400 sm:hover:scale-90"
														onClick={() =>
															changeOrder({
																id: orderPending.id,
																status: "Rechazada",
															})
														}
													>
														Cancel
													</button>
												</>
											)}
										</div>
									</ListOrder>
									;
								</>
							);
						})}

					{pending && order.pending.length === 0 && (
						<p
							className={`order-list h-10 ${
								pending === "animation"
									? "animate-jump-out animate-delay-[45ms] "
									: "animate-fade-down "
							} animate-once animate-duration-1000ms `}
						>
							Is empty
						</p>
					)}
					<div className="order-list">
						Waiting{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2  cursor-pointer lg:hover:scale-125 lg:hover:text-yellowPrimary ${
								waiting && "rotate-180"
							}`}
							onClick={() => {
								if (waiting) {
									setWaiting("animation");

									const timer = setTimeout(() => {
										setWaiting(false);
										setAnimationEnd(false);
									}, 500);
									return () => clearTimeout(timer);
								}
								setWaiting(true);
							}}
						/>
					</div>
					{waiting &&
						order.waiting.length > 0 &&
						order.waiting.map((orderWaiting) => (
							<ListOrder
								key={orderWaiting.id}
								order={orderWaiting}
								user={user}
								done={waiting}
							>
								<div className="flex flex-col items-center sm:flex-row sm:justify-center">
									{typeAccount === "service" ? (
										<>
											<button
												className="btn scale-75 bg-green-500 sm:hover:scale-90"
												onClick={() =>
													changeOrder({
														id: orderWaiting.id,
														status: "Aceptada",
													})
												}
											>
												Agreed
											</button>
											<button
												className="btn scale-75 bg-red-400  sm:hover:scale-90"
												onClick={() =>
													changeOrder({
														id: orderWaiting.id,
														status: "Rechazada",
													})
												}
											>
												Reject
											</button>
										</>
									) : (
										<button
											className="btn scale-75 bg-red-400 sm:hover:scale-90"
											onClick={() =>
												changeOrder({
													id: orderWaiting.id,
													status: "Rechazada",
												})
											}
										>
											Cancel
										</button>
									)}
								</div>
							</ListOrder>
						))}
					{waiting && order.waiting.length === 0 && (
						<p
							className={`order-list h-10 ${
								waiting === "animation"
									? "animate-jump-out animate-delay-[45ms] "
									: "animate-fade-down "
							} animate-once animate-duration-1000ms `}
						>
							Is empty
						</p>
					)}
					<div className="order-list">
						Agreed{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2  cursor-pointer lg:hover:scale-125 lg:hover:text-yellowPrimary ${
								agreed && "rotate-180"
							}`}
							onClick={() => {
								if (agreed) {
									setAgreed("animation");

									const timer = setTimeout(() => {
										setAgreed(false);
										setAnimationEnd(false);
									}, 500);
									return () => clearTimeout(timer);
								}
								setAgreed(true);
							}}
						/>
					</div>
					{agreed &&
						order.agreed.length > 0 &&
						order.agreed.map((orderAgreed) => (
							<ListOrder
								key={orderAgreed.id}
								order={orderAgreed}
								user={user}
								done={agreed}
							>
								{user.id === orderAgreed.id_service ? (
									<div className="flex flex-col items-center sm:flex-row sm:justify-center">
										<button
											className="btn scale-75 bg-green-500  sm:hover:scale-90"
											onClick={() =>
												doneOrder({
													id: orderAgreed.id,
												})
											}
										>
											Done
										</button>
									</div>
								) : (
									<></>
								)}
							</ListOrder>
						))}
					{agreed && order.agreed.length === 0 && (
						<p
							className={`order-list h-10 ${
								agreed === "animation"
									? "animate-jump-out animate-delay-[45ms] "
									: "animate-fade-down "
							} animate-once animate-duration-1000ms `}
						>
							Is empty
						</p>
					)}
					<div className="order-list">
						Rejected{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2  cursor-pointer lg:hover:scale-125 lg:hover:text-yellowPrimary ${
								rejected && "rotate-180"
							}`}
							onClick={() => {
								if (rejected) {
									setRejected("animation");

									const timer = setTimeout(() => {
										setRejected(false);
										setAnimationEnd(false);
									}, 500);
									return () => clearTimeout(timer);
								}
								setRejected(true);
							}}
						/>
					</div>
					{rejected &&
						order.rejected.length > 0 &&
						order.rejected.map((orderRejected) => (
							<ListOrder
								key={orderRejected.id}
								order={orderRejected}
								user={user}
								done={rejected}
							/>
						))}
					{rejected && order.rejected.length === 0 && (
						<p
							className={`order-list h-10 ${
								rejected === "animation"
									? "animate-jump-out animate-delay-[45ms] "
									: "animate-fade-down "
							} animate-once animate-duration-1000ms `}
						>
							Is empty
						</p>
					)}
					<div className="order-list">
						Done{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2  cursor-pointer lg:hover:scale-125 lg:hover:text-yellowPrimary ${
								done && "rotate-180"
							}`}
							onClick={() => {
								if (done) {
									setDone("animation");

									const timer = setTimeout(() => {
										setDone(false);
										setAnimationEnd(false);
									}, 500);
									return () => clearTimeout(timer);
								}
								setDone(true);
							}}
						/>
					</div>
					{done &&
						order?.done.length > 0 &&
						order.done.map((orderDone) => (
							<ListOrder
								key={orderDone.id}
								order={orderDone}
								user={user}
								done={done}
							>
								{user?.email === orderDone.id_client.email &&
								user?.id === orderDone.id_client.id ? (
									<div className="flex flex-col items-center sm:flex-col sm:justify-center">
										{review && (
											<FormReview
												order={orderDone}
												user={user}
												stateReview={(data) => setReview(data)}
											></FormReview>
										)}

										{!orderDone.comment && (
											<>
												{review === "ready" ? (
													<></>
												) : (
													<button
														className={`btn scale-75 ${
															review ? "bg-red-400" : "bg-green-500"
														}  sm:hover:scale-90 hover:text-gray-900`}
														onClick={() => {
															if (review) {
																setReview(false);
															} else {
																setReview(true);
															}
														}}
													>
														{review === false && "Do a Review"}
														{review === true && "Cancel"}
													</button>
												)}
											</>
										)}
									</div>
								) : (
									<></>
								)}

								{orderDone.comment && (
									<div className="w-2/3 mx-auto">
										<TextField
											description={orderDone.comment.comment}
											tittle={orderDone.id_client.name}
											rating={orderDone.comment.rating}
										></TextField>
									</div>
								)}
								{user?.email === orderDone.id_client.email &&
								user?.id === orderDone.id_client.id ? (
									<></>
								) : (
									<></>
								)}
							</ListOrder>
						))}
					{done && order.done.length === 0 && (
						<p
							className={`order-list h-10 ${
								done === "animation"
									? "animate-jump-out animate-delay-[45ms] "
									: "animate-fade-down "
							} animate-once animate-duration-1000ms `}
						>
							Is empty
						</p>
					)}
				</>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
}

export default Orders;
