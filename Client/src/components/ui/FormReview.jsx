import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { createReview } from "../../api/auth";
import Alert from "./Alert";
import TextField from "./TextField";

function FormReview({ order, user, stateReview }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [rating, setRating] = useState(0);
	const [hover, setHover] = useState(null);
	const [reviewState, setReviewState] = useState(null);
	const [alert, setAlert] = useState(null);
	const [description, setDescription] = useState("");
	const [ready, setReady] = useState(false);

	const onSubmit = handleSubmit(async (data) => {
		data.rating = rating;
		data.order = order;
		data.user = user;
		setDescription(data.comment);

		try {
			let res = await createReview(data);
			setReviewState({
				code: res.status,
				message: res.data.message,
			});
			setReady(true);
			stateReview('ready');
		} catch (error) {
			console.log(error);
			setReviewState({
				code: error?.request?.status,
				message: error.response.data.message,
			});
			stateReview(true);
			setReady(false);
		}
	});
	useEffect(() => {
		if (reviewState == null) return;

		alertReview(reviewState);
	}, [reviewState]);

	function alertReview(data) {
		if (data.code === 200) {
			setAlert({ message: data.message, color: "bg-green-400" });
		} else if (data.code === 409) {
			setAlert({ message: data.message, color: "bg-red-400" });
		} else {
			setAlert({
				message: "hubo algunos problema, intentelo de nuevo mas tarde",
				color: "bg-red-400",
			});
		}

		const timer = setTimeout(() => {
			setAlert("animation");

			const timer = setTimeout(() => {
				setAlert(false);
			}, 500);
			return () => clearTimeout(timer);
		}, 5000);
		return () => clearTimeout(timer);
	}
	return (
		<>
			{alert && (
				<Alert message={alert.message} color={alert.color} animation={alert} />
			)}
			{ready ? (
				<div className="w-2/3">
					<TextField
						description={description}
						tittle={user.name}
						rating={rating}
					></TextField>
				</div>
			) : (
				<form
					className="flex flex-col w-[80%] -ml-3 items-center"
					onSubmit={onSubmit}
				>
					<div>
						<textarea
							className="rounded-lg m-2 w-full  pl-2 outline-none text-black overflow-scroll lg:overflow-hidden"
							id="comment"
							cols="30"
							rows="6"
							placeholder="Write your comment"
							{...register("comment", {
								required: "Empty Field",
							})}
						></textarea>
					</div>
					{errors.comment && (
						<span className="msg-error">{errors.comment.message}</span>
					)}
					<div className="flex my-2 ml-2">
						{[...Array(5)].map((star, index) => {
							const currentRating = index + 1;
							return (
								<label key={index}>
									<input
										type="radio"
										className="hidden"
										value={currentRating}
										onClick={() => {
											setRating(currentRating);
										}}
									></input>
									<FaStar
										className="w-full cursor-pointer "
										size={30}
										color={
											currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
										}
										onMouseEnter={() => setHover(currentRating)}
										onMouseLeave={() => setHover(null)}
									></FaStar>
								</label>
							);
						})}
					</div>
					<button className="btn scale-75 bg-yellowPrimary text-black ml-3 ">
						Send
					</button>
				</form>
			)}
		</>
	);
}

export default FormReview;
