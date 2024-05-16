import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();
	const navigate = useNavigate();
	const { signin, isAutheticated, errors: errorsBack } = useAuth();

	const onSubmit = handleSubmit(async (value) => {
		try {
			await signin(value);
		} catch (error) {
			console.log(error);
		}
	});

	useEffect(() => {
		if (isAutheticated) navigate("/");
	}, [isAutheticated]);

	return (
		<div className="container-form text-center mb-2">
			<h2 className="font-bold text-2xl cursor-default">Login</h2>
			<form className="  pl-[5%] sm:pl-0 text-center flex flex-col items-center" onSubmit={onSubmit}>
				<div className="w-1/2">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						placeholder="Email"
						name="email"
						id="email"
						{...register("email", {
							required: {
								value: true,
								message: "Empty Field",
							},
						})}
					/>
					{errors.email && (
						<span className="msg-error">{errors.email.message}</span>
					)}
				</div>
				<div className="w-1/2">
					<Label htmlFor="password">Password</Label>
					<Input
						type="password"
						placeholder="Password"
						name="password"
						id="password"
						{...register("password", {
							required: {
								value: true,
								message: "Empty Field",
							},
							minLength: {
								value: 8,
								message: "must have at least 8 characters",
							},
						})}
					/>
					{errors.password && (
						<span className="msg-error">{errors.password.message}</span>
					)}
				</div>
				<div className="mt-5 mb-2 text-center col-span-2">
					<button
						type="submit"
						className="font-semibold bg-gray-400 cursor-pointer 
      						  	pl-2 pr-2 pt-1.5 pb-1.5 rounded hover:scale-110 transition
     					 		hover:bg-gray-300 focus:ring-2 focus:ring-white w-16 min-w-max"
					>
						Send
					</button>
				</div>
				<div>
					{errorsBack.map((error, i) => {
						return (
							<p key={i} className="msg-error ">
								{error.message}
							</p>
						);
					})}
				</div>
			</form>
			<div>
				<p>
					Do you not have an <Link to="/register" className="font-bold text-sky-500">account?</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
