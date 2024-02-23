import React, { useState } from "react";

function CardHistory({ user }) {
	const [showMore, setShowMore] = useState(false);
	const itemsToShow = showMore ? user.orders.length : 3;

	return (
		<section className="bg-gray-600 text-gray-100 relative z-10 rounded-md p-2">
			<div className="flex flex-col items-center font-semibold">
				<h2 className="text-xl">{user.orders.length}</h2>
				<p className="text-xs">Ride</p>
			</div>
			{
			user.orders.length > 0 ? (
				
			<div >
			<table className="bg-gray-600 p-1 text-center w-full my-2">
				<thead className="text-xs border-b-2 border-gray-950 ">
					<tr className="h-6">
						<th>User</th>
						<th>Driver</th>
						<th>Date</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody className="text-xs">
					{user.orders.slice(0, itemsToShow).map((order, i) => {
						const date = new Date(order.date);

						// Obtener el año, mes y día
						const year = date.getFullYear();
						const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
						const day = date.getDate();

						// Crear la cadena de fecha en el formato deseado (por ejemplo, "YYYY-MM-DD")
						const formattedDate = `${year}-${
							month < 10 ? "0" + month : month
						}-${day < 10 ? "0" + day : day}`;

						order.date = formattedDate;
						return (
							<tr key={i} className="h-8 border-b-2 border-gray-950">
								<td>{order.Client.name}</td>
								<td>{order.Service.name}</td>
								<td>{order.date}</td>
								<td>{order.status}</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			{user.orders.length > 3 && (
				<button
					onClick={() => setShowMore(!showMore)}
					className="text-sm font-semibold cursor-pointer hover:text-gray-500 transition-all"
				>
					{!showMore ? "Show More" : "Cover"}
				</button>)
			}
		</div>
				): (
					<div className="text-center font-bold text-red-500">
						<h2>No previous history</h2>
					</div>
					)
			}
		</section>
	);
}

export default CardHistory;
