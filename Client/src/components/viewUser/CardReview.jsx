import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import TextField from "../ui/TextField";

function CardReview({ user = props }) {
	const [showMore, setShowMore] = useState(false);
	const itemsToShow = user.comments ? user.comments.length : 3;
	return (
		<section className="bg-gray-600 text-gray-100 relative z-10 rounded-md p-2 lg:text-base cursor-default">
			<div className="flex flex-col items-center">
				<h2 className="flex items-center">
					{user.rating || 0}
					<FaStar color="yellow" />
				</h2>
				<p className="text-xs"> {user.comments.length} Review</p>
			</div>
			{user.comments.length > 0 ? (
				<div>
					{user.comments.slice(0, itemsToShow).map((comment, index) => (
						<TextField
							key={index}
							description={comment.comment}
							tittle={`${comment.id_order.Client.name} ${comment.id_order.Client.lastName} `}
						/>
					))}
					{!showMore && user.comments.length > 3 && (
						<button onClick={() => setShowMore(true)}>Show more</button>
					)}
				</div>
			) : (
				<div className="text-center font-bold text-red-500">
					<h2>No previous history</h2>
				</div>
			)}
		</section>
	);
}

export default CardReview;
