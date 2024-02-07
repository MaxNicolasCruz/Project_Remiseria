import React from "react";

const Alert = ({ message, color }) => {
	return (
		<div
			className={`fixed top-5 right-5 p-3 rounded ${color} opacity-80 z-50`}
		>
			{message}
		</div>
	);
};

export default Alert;
