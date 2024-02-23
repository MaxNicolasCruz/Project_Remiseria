import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

function TextField({ description, tittle, rating }) {
	const [showText, setShowText] = useState(false);

	const content = showText ? description : description.slice(0, 200) + "...";
	return (
		<div className="py-3 pl-2 text-sm sm:mx-2">
			<h2 className="inline-block">{tittle}:</h2>
			{rating && (
				<span className="float-right flex items-center">
					rating<FaStar color="yellow" />
				</span>
			)}

			<div className="rounded-lg bg-slate-200 w-full h-auto text-slate-900 font-semibold overflow-scroll lg:overflow-hidden transition-transform">
				<p className="pl-2 pt-1 line-clamp-3 sm:line-clamp-5">{content}</p>
				<p
					className="float-right pr-1 text-xs cursor-pointer"
					onClick={() => setShowText(!showText)}
				>
					{showText ? "Show less" : "Show more"}
				</p>
			</div>
		</div>
	);
}

export default TextField;
