import React from "react";

function ImageProfile({image}) {
	return (
		<div className="w-3/6 h-full flex justify-center lg border-2 border-red-400">
			<img src={image} alt="foto del usuario" className="rounded-full" />
		</div>
	);
}

export default ImageProfile;
