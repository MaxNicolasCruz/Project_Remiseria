import React from "react";

function Message({ message, user }) {
	return (
		<div
			className={` w-auto max-w-[80%] p-2 flex text-sm items-center h-auto  ${
				message.from.name === "me" ? "flex-row-reverse float-end" : ""
			} `}
		>
			<div className="min-w-8 w-8 h-8 ">
				<img
					src={message.from?.name === "me" ? message.from?.image : user?.image}
					alt="imagen de usuario"
					className="w-full h-full rounded-full"
				/>
			</div>
			<div
				className={`p-1 rounded-md w-full whitespace-break-spaces break-words ${
					message.from.name === "me"
						? "mr-0.5 bg-gray-300"
						: "ml-0.5 bg-yellowPrimary"
				}`}
			>
				{`${message.from?.name || user.name}: ${message.message}`}
			</div>
		</div>
	);
}

export default Message;
