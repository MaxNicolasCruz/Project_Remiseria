import React from "react";

const Alert = ({ message, color, animation }) => {
	return (
		<div
			className={`fixed top-5 right-5 p-3 rounded ${color} opacity-80 z-50 ${
				animation === "animation"
					? "animate-ping animate-duration-[1000ms] animate-delay-[20ms]"
					: "animate-jump-in animate-once animate-duration-{500ms} animate-delay-0"
			} `}
		>
			{message}
		</div>
	);
};

export default Alert;
