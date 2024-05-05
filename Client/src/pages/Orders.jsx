import React, { useEffect, useState } from "react";
import { FaCircleArrowDown } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { getOrderClient, getOrderService } from "../api/auth";
import ListOrder from "../components/ui/ListOrder";
import { useChat } from "../context/ChatContext";


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
					<div
						className="order-list "
						onClick={() => {
							setPending(!pending);
						}}
					>
						Pending{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2 cursor-pointer lg:hover:scale-125 lg:hover:text-yellowPrimary  ${
								pending && "rotate-180"
							}`}
						/>
					</div>
					{pending &&
						order.pending.length > 0 &&
						order.pending.map((orderPending, i) => {
							return (
								<>
									<ListOrder order={orderPending} key={i}>
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
																status: "Rechzada",
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
						<p className="order-list h-10 animate-fade-down animate-once animate-duration-1000ms ">
							Is empty
						</p>
					)}
					<div
						className="order-list"
						onClick={() => {
							setWaiting(!waiting);
						}}
					>
						Waiting{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2 ${waiting && "rotate-180"}`}
						/>
					</div>
					{waiting &&
						order.waiting.length > 0 &&
						order.waiting.map((orderWaiting) => (
							<ListOrder key={orderWaiting.id} order={orderWaiting}>
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
						<p className="order-list h-10 animate-fade-down animate-once animate-duration-1000ms ">
							Is empty
						</p>
					)}
					<div
						className="order-list"
						onClick={() => {
							setAgreed(!agreed);
						}}
					>
						Agreed{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2 ${agreed && "rotate-180"}`}
						/>
					</div>
					{agreed &&
						order.agreed.length > 0 &&
						order.agreed.map((orderAgreed) => (
							<ListOrder key={orderAgreed.id} order={orderAgreed}>
								{typeAccount === "service" ? (
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
						<p className="order-list h-10 animate-fade-down animate-once animate-duration-1000ms ">
							Is empty
						</p>
					)}
					<div
						className="order-list"
						onClick={() => {
							setRejected(!rejected);
						}}
					>
						Rejected{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2 ${rejected && "rotate-180"}`}
						/>
					</div>
					{rejected &&
						order.rejected.length > 0 &&
						order.rejected.map((orderRejected) => (
							<ListOrder key={orderRejected.id} order={orderRejected} />
						))}
					{rejected && order.rejected.length === 0 && (
						<p className="order-list h-10 animate-fade-down animate-once animate-duration-1000ms ">
							Is empty
						</p>
					)}
					<div
						className="order-list"
						onClick={() => {
							setDone(!done);
						}}
					>
						Done{" "}
						<FaCircleArrowDown
							className={`transition-all ml-2 ${done && "rotate-180"}`}
						/>
					</div>
					{done &&
						order.done.length > 0 &&
						order.done.map((orderDone) => (
							<ListOrder key={orderDone.id} order={orderDone} />
						))}
					{done && order.done.length === 0 && (
						<p className="order-list h-10 animate-fade-down animate-once animate-duration-1000ms ">
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
