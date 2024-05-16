import React, { Children, useEffect, useState } from "react";

import { formatDistanceToNow, differenceInYears } from "date-fns";

function ListOrder({ order, children, done, user }) {
	const [client, setClient] = useState(false);

	useEffect(() => {
		if (order.Service.id == user.id && order.Service.email == user.email) {
			setClient(order.id_client);
			return;
		}
		setClient(order.Service);
	}, []);

	return (
		<div
			className={`bg-slate-500 text-white w-2/3 max-w-lg mx-auto my-1 p-1 ${
				done === "animation"
					? "animate-jump-out animate-delay-[45ms] "
					: "animate-fade-down animate-once animate-duration-1000ms rounded-lg"
			} `}
		>
			<div className="w-1/2 flex mx-auto my-2 max-w-44 max-h-44">
				<img
					src={client.image}
					alt="user image"
					className="w-full h-full rounded-full"
				/>
			</div>
			<div className="text-sm ml-2 sm:grid sm:grid-cols-2 justify-center items-center">
				<p className="mb-1 text-center">
					<strong>Name</strong>:{` ${client.name} ${client.last_name}`}{" "}
				</p>
				<p className="mb-1 text-center">
					<strong>Genre</strong>: {client.genre}
				</p>
				<p className="mb-1 text-center">
					<strong>Years Old</strong>:
					{differenceInYears(new Date(), new Date(client.date_of_birth))}
				</p>
				<p className="mb-1 text-center">
					<strong>From</strong>: {client.city}
				</p>
				<p className="mb-1 text-center">
					<strong>Location</strong>: ubicacion
				</p>
				<p className="mb-1 text-center">
					<strong>Time</strong>:{" "}
					{formatDistanceToNow(new Date(order.date), { addSuffix: true })}
				</p>
			</div>
			{children}
		</div>
	);
}

export default ListOrder;
