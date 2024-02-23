import React, { useEffect } from "react";
import { useState } from "react";
import TextField from "../ui/TextField";
function CardInfo({ user, status = props }) {
	

	return (
		<>
		{user ? (
		<div className="bg-gray-600 text-gray-100 relative z-10 rounded-md p-2 cursor-default ">
		<div className="grid grid-cols-3 text-xs gap-y-2 sm:gap-y-3 sm:grid-cols-4 sm:px-5 sm:py-1 lg:text-base">
			<div>
				<h2>Name:</h2>
				<p className="font-bold">{`${user.name}`}</p>
			</div>
			<div>
				<h2>Years:</h2>
				<p className="font-bold">{user.dateOfBirth}</p>
			</div>
			<div>
				<h2>Genre:</h2>
				<p className="font-bold">{user.genre}</p>
			</div>
			<div>
				<h2>Country:</h2>
				<p className="font-bold">{user.country}</p>
			</div>
			<div>
				<h2>City:</h2>
				<p className="font-bold">{user.city}</p>
			</div>
			<div>
				<h2>Number:</h2>
				<p className="font-bold">{user.numberPhone}</p>
			</div>
		</div>
		<TextField description={user.description} tittle={'About Me'}/>
		
		<div className="grid grid-cols-1 text-xs gap-y-2 sm:px-5 sm:grid-cols-3 pb-2 lg:text-base ">
			<div className="sm:col-span-3">
				<h2>Type of Vehicle:</h2>
				<div className="overflow-scroll h-auto w-full lg:overflow-hidden ">
					<p className="font-bold pr-3">
						{user.vehicleType}
					</p>
				</div>
			</div>
			<div>
				<h2>Working Hours:</h2>
				<p className="font-bold ">{user.workingHours}</p>
			</div>
			<div>
				<h2>Payment Methods:</h2>
				<p className="font-bold">{user.methodOfPayment}</p>
			</div>
			<div>
				<h2>State:</h2>
				<p className={`font-bold ${status.text}`}>{user.state}</p>
			</div>
		</div>
	</div>
		) : (
		<h2>loading...</h2>
		)}
		</>
	);
}

export default CardInfo;
