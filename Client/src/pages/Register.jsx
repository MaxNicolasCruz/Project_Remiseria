import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Label from "../components/ui/Label";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { getProvices, getProvincesByName } from "../api/provinceApi";

function Register() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm();
	const [selectedProvince, setSelectedProvince] = useState("");
	const [provinces, setProvinces] = useState([]);
	const [selectedProvinceData, setSelectedProvinceData] = useState(null);
	const [typeRegister, setTypeRegister] = useState(false);
	const { signup, isAutheticated, errors: errorsBack } = useAuth();

	const onSubmit = handleSubmit(async (values) => {
		try {
			// Convierte el género a entero si es necesario
			values.genre = parseInt(values.genre, 10);

			//configuramos el formData
			if (typeRegister) {
				values.workingHours = parseInt(values.workingHours, 10);
				values.methodOfPayment = parseInt(values.methodOfPayment, 10);
				values.state = parseInt(values.state, 10);
			}

			const formData = new FormData();

			// Agrega todos los campos del formulario al formData
			Object.keys(values).forEach((key) => {
				if (key === "image") {
					formData.append(key, values[key][0]);
				} else {
					formData.append(key, values[key]);
				}
			});
			// Pasa el formData como argumento al método signup
			try {
				await signup(formData, typeRegister);
				// Navegar a la página de inicio de sesión después de un registro exitoso
				navigate("/login");
			} catch (error) {
				console.error("Error al procesar el formulario:", error);
			}
		} catch (error) {
			console.error("Error al procesar el formulario:", error);
		}
	});

	function client() {
		setTypeRegister(false);
	}
	function taxi() {
		setTypeRegister(true);
	}

	useEffect(() => {
		async function getProvicesAll() {
			try {
				// Puedes esperar aquí
				let provinces = await getProvices();
				setProvinces(provinces.data.provincias);
				// Actualizar el estado con los datos obtenidos
			} catch (error) {
				console.error("Error al obtener datos:", error);
			}
		}
		getProvicesAll();
	}, []);

	useEffect(() => {
		async function fetchProvinceData() {
			try {
				if (selectedProvince) {
					const response = await getProvincesByName(selectedProvince);
					setSelectedProvinceData(response.data.parametros.nombre); // Ajusta según la estructura de datos de tu API
				}
			} catch (error) {
				console.error("Error al obtener datos de la provincia:", error);
			}
		}

		fetchProvinceData();
	}, [selectedProvince]);

	return (
		<div className="container-form">
			<div className="flex justify-around items-center">
				<Button onClick={client}>Client</Button>
				<h2 className="font-bold cursor-default">OR</h2>
				<Button onClick={taxi}>Taxi</Button>
			</div>
			<h2 className="font-bold text-center text-2xl cursor-default">User</h2>

			<form
				className="sm:grid grid-cols-2 pl-[5%] sm:pl-0 place-items-center text-center"
				onSubmit={onSubmit}
			>
				<div>
					<Label htmlFor="name">Name</Label>
					<Input
						type="text"
						placeholder="Name"
						name="name"
						id="name"
						{...register("name", {
							required: {
								value: true,
								message: "Empty Field",
							},
							minLength: {
								value: 3,
								message: "Debe tener mínimo 3 caracteres",
							},
						})}
					/>

					{errors.name && (
						<span className="msg-error">{errors.name.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="lastName">Last name</Label>
					<Input
						type="text"
						placeholder="Last Name"
						name="lastName"
						id="lastName"
						{...register("lastName", {
							required: {
								value: true,
								message: "Empty Field",
							},
							minLength: {
								value: 3,
								message: "Debe tener minimo 3 caracteres",
							},
						})}
					/>
					{errors.lastName && (
						<span className="msg-error">{errors.lastName.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="genre">Genre</Label>
					<select
						name="genre"
						id="genre"
						className="text-black rounded outline-none w-[189px] "
						{...register("genre", {
							required: true,
							message: "Empty Field",
						})}
					>
						<option value="1" className="bg-slate-100">
							Undefined
						</option>
						<option value="2" className="bg-slate-100 ">
							Woman
						</option>
						<option value="3" className="bg-slate-100 ">
							Man
						</option>
					</select>
					{errors.genre && (
						<span className="msg-error">{errors.genre.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="dateOfBirth">Date of Birth</Label>
					<input
						type="date"
						name="dateOfBirth"
						id="dateOfBirth"
						className="text-black rounded outline-none w-[189px] "
						{...register("dateOfBirth", {
							required: {
								value: true,
								message: "Empty Field",
							},
							validate: (value) => {
								const dateUser = new Date(value);
								const dateNow = new Date();
								const oldYear = dateNow.getFullYear() - dateUser.getFullYear();
								return oldYear > 18 || "must be of legal age";
							},
						})}
					/>
					{errors.dateOfBirth && (
						<span className="msg-error">{errors.dateOfBirth.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="city">City</Label>
					<select
						name="city"
						id="city"
						value={selectedProvince}
						className="select-style w-[50%]"
						{...register("city", {
							required: {
								value: true,
								message: "Empty Field",
							},
						})}
						onChange={(e) => setSelectedProvince(e.target.value)}
					>
						<option value="" disabled>
							Selecciona una provincia
						</option>
						{provinces.map((province) => (
							<option key={province.id} value={province.nombre}>
								{province.nombre}
							</option>
						))}
					</select>
					{errors.city && (
						<span className="msg-error">{errors.city.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="country">Country</Label>
					<Input
						type="text"
						placeholder="Country"
						name="country"
						id="country"
						value="Argentina"
						{...register("country", {
							required: {
								value: true,
								message: "Empty Field",
							},
						})}
					/>
					{errors.country && (
						<span className="msg-error">{errors.country.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="numberPhone">Number of Phone</Label>
					<Input
						type="number"
						placeholder="Phone"
						name="numberPhone"
						id="numberPhone"
						{...register("numberPhone", {
							required: {
								value: true,
								message: "Empty Field",
							},
							minLength: {
								value: 9,
								message: "must have at least 9 characters",
							},
						})}
					/>
					{errors.numberPhone && (
						<span className="msg-error">{errors.numberPhone.message}</span>
					)}
				</div>
				<div>
					<Label htmlFor="numberDocument">Number of Document</Label>
					<Input
						type="number"
						placeholder="Document"
						name="numberDocument"
						id="numberDocument"
						{...register("numberDocument", {
							required: {
								value: true,
								message: "Empty Field",
							},
							minLength: {
								value: 7,
								message: "must have at least 7 characters",
							},
						})}
					/>
					{errors.numberDocument && (
						<span className="msg-error">{errors.numberDocument.message}</span>
					)}
				</div>

				<div className="relative mt-2 grid place-items-center ">
					<h2>Image For User</h2>
					<div className="relative">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-16 h-16"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
						<label
							htmlFor="image"
							className="absolute left-[39px] top-[38px] rounded-full bg-[#2e2e2e] "
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6 text-white bg-[#2e2e2e] rounded-[17%] cursor-pointer hover:text-slate-200 "
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
								/>
							</svg>
						</label>
					</div>

					<Input
						type="file"
						name="image"
						id="image"
						className="mt-2 hidden"
						{...register("image", {
							required: {
								value: true,
								message: "Empty Field",
							},
						})}
					/>
					{errors.image && (
						<span className="msg-error">{errors.image.message}</span>
					)}
				</div>
				{typeRegister && (
					<>
						<div>
							<Label htmlFor="vehicleType">Type Vehicle</Label>
							<Input
								type="text"
								placeholder="Vehicle"
								name="vehicleType"
								id="vehicleType"
								className="placeholder:pb-20 text-black outline-none rounded pl-1 pr-1 "
								{...register("vehicleType", {
									required: {
										value: true,
										message: "Empty Field",
									},
									minLength: {
										value: 7,
										message: "must have at least 7 characters",
									},
								})}
							/>
							{errors.vehicleType && (
								<span className="msg-error">{errors.vehicleType.message}</span>
							)}
						</div>
						<div>
							<Label htmlFor="workingHours">Working Hours</Label>
							<select
								name="workingHours"
								id="workingHours"
								className=" select-style "
								{...register("workingHours", {
									required: true,
									message: "Empty Field",
								})}
							>
								<option value="2">Morning: 06am - 12pm</option>
								<option value="3">Noon: 12pm - 18pm</option>
								<option value="4">Night: 18pm - 00am</option>
							</select>
							{errors.workingHours && (
								<span className="msg-error">{errors.workingHours.message}</span>
							)}
						</div>
						<div>
							<Label htmlFor="methodOfPayment">Method of Pay</Label>
							<select
								name="methodOfPayment"
								id="methodOfPayment"
								className="select-style "
								{...register("methodOfPayment", {
									required: true,
									message: "Empty Field",
								})}
							>
								<option value="1">Paypal</option>
								<option value="2">Cash</option>
								<option value="3">Mercado Pago</option>
								<option value="4">Uala</option>
							</select>
							{errors.methodOfPayment && (
								<span className="msg-error">
									{errors.methodOfPayment.message}
								</span>
							)}
						</div>
						<div>
							<Label htmlFor="state">State</Label>
							<select
								name="state"
								id="state"
								className="select-style "
								{...register("state", {
									required: true,
									message: "Empty Field",
								})}
							>
								<option value="1">In Service</option>
								<option value="2">Out Service</option>
								<option value="3">In Order</option>
							</select>
							{errors.state && (
								<span className="msg-error">{errors.state.message}</span>
							)}
						</div>
					</>
				)}
				<div>
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
				<div>
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
				<div>
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<Input
						type="password"
						placeholder="Confirm"
						name="confirmPassword"
						id="confirmPassword"
						{...register("confirmPassword", {
							required: {
								value: true,
								message: "Empty Field",
							},
							validate: (value) =>
								value === watch().password || "Passwords do not match",
						})}
					/>
					{errors.confirmPassword && (
						<span className="msg-error">{errors.confirmPassword.message}</span>
					)}
				</div>

				<div className="mt-5 text-center col-span-2">
					<div>
						{errorsBack[0] &&
							errorsBack[0].error.map((error, i) => {
								return (
									<p key={i} className="msg-error mb-1">
										{error.message}
									</p>
								);
							})}
					</div>
					<button
						type="submit"
						className="font-semibold bg-gray-400 cursor-pointer 
      						  	pl-2 pr-2 pt-1.5 pb-1.5 rounded hover:scale-110 transition
     					 		hover:bg-gray-300 focus:ring-2 focus:ring-white w-16 min-w-max"
					>
						Send
					</button>
				</div>
			</form>
			<div className="flex justify-between">
				<p>
					Dont, you have an account{" "}
					<Link to="/login" className="text-sky-500">
						Sign up
					</Link>
				</p>
				<p>
					Dont, you remember you password?
					<Link to="/login" className="text-sky-500">
						{" "}
						Change password
					</Link>
				</p>
			</div>
		</div>
	);
}

export default Register;
