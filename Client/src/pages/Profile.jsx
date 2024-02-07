import React, { useEffect, useState } from "react";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import Button from "../components/ui/Button";
import { getProvices } from "../api/provinceApi";
import { updateClientRequest, updateServiceRequest } from "../api/auth";
import Alert from "../components/ui/alert";
import { RiLoader2Fill } from "react-icons/ri";

function Profile() {
	const { isAutheticated, user } = useAuth();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			name: user.name,
			lastName: user.lastName,
			dateOfBirth: user.dateOfBirth,
			city: user.city,
			genre: user.genre?.genre || undefined,
			country: user.country,
			numberPhone: user.numberPhone,
			numberDocument: user.numberDocument,
			email: user.email,
			password: user.password,
			// Añade otras propiedades según sea necesario
			vehicleType: user.vehicleType || undefined,
			workingHours: user.workingHours?.id || undefined,
			methodOfPayment: user.methodOfPayment?.id || undefined,
			state: user.state?.id || undefined,
		},
	});
	const [slide, setSlide] = useState(false);
	const [isEditing, setEditing] = useState(false);
	const [typeAccount, setTypeAccount] = useState(false);
	const [provinces, setProvinces] = useState(false);
	const [loading, setLoading] = useState(true);
	const [load, setLoad] = useState(true);
	const [errorsBack, setErrors] = useState([]);
	const [selectedProvinceData, setSelectedProvinceData] = useState(
		user.city || ""
	);

	useEffect(() => {
		setTypeAccount(Object.keys(user).length > 11);
	}, [user]);

	useEffect(() => {
		if (errorsBack.length > 0) {
			const timer = setTimeout(() => {
				setErrors([]);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [errorsBack]);
	// console.log(watch());
	const onSubmit = handleSubmit(async (data) => {
		// Aquí puedes realizar alguna lógica de validación si es necesario

		const { genre, password, dateOfBirth, numberDocument, email, ...postData } =
			data;
		try {
			// Crea un nuevo objeto FormData
			const formData = new FormData();

			if (typeAccount) {
				postData.workingHours = parseInt(postData.workingHours, 10);
				postData.methodOfPayment = parseInt(postData.methodOfPayment, 10);
				postData.state = parseInt(postData.state, 10);
			}

			///Agrega todos los campos del formulario al formData
			Object.keys(postData).forEach((key) => {
				if (key === "image") {
					if (postData[key] && postData[key].length === 1) {
						formData.append(key, postData[key][0]);
					} else {
						formData.append(key, null);
					}
				} else {
					formData.append(key, postData[key]);
				}
			});
			console.log(postData); // Esto debería mostrar los datos actualizados

			// Después de realizar las operaciones, puedes desactivar el modo de edición
			console.log("ready for send back");
			if (typeAccount) {
				let res = await updateServiceRequest(formData);
				console.log(res);

				setLoading({ status: "successfully saved", color: "bg-green-500" });
				window.location.reload();
				return;
			} else {
				let res = await updateClientRequest(formData);
				console.log(res);
				setLoading({ status: "successfully saved", color: "bg-green-500" });
				window.location.reload();
				return;
			}
		} catch (error) {
			setLoading({ status: "Error when saving changes", color: "bg-red-500" });
			setErrors([error.response.data]);
			console.error("Error when saving changes:", error);
		}
	});

	useEffect(() => {
		async function getProvicesAll() {
			try {
				// Puedes esperar aquí

				let res = await getProvices();
				setProvinces(res.data.provincias);
				// Actualizar el estado con los datos obtenidos
			} catch (error) {
				console.error("Error al obtener datos:", error);
			}
		}
		getProvicesAll();

		timeLoad();
	}, []);

	function handleProvinceChange(event) {
		if (event.target.value !== selectedProvinceData) {
			setSelectedProvinceData(event.target.value);
		}
	}
	const timeLoad = () => {
		// Esperar 2 segundos antes de cambiar el estado a false
		setTimeout(() => {
			setLoad(false);
		}, 1000);
	};
	return (
		<main className="bg-gray-800 py-2">
			{loading && <Alert message={loading.status} color={loading.color} />}
			<div className=" bg-slate-600 mx-auto max-w-[90%] rounded py-1 mt-2 lg:max-w-[900px]">
				<div className="conteinerCard-profile">
					{!load ? (
						<>
							<div className="h-44 w-full max-w-[185px] text-center relative">
								<div className=" bg-gray-800 w-24 h-24 transform-rombo absolute left-[45px] top-[40px] overflow-hidden shadow-common">
									<img
										src={user.image}
										alt="user picture"
										className="-rotate-45 ml-[8px] scale-[1.15] "
									/>
								</div>
							</div>
							<div>
								<form
									className="sm:grid grid-cols-2 pl-[5%] sm:pl-0 place-items-center text-center sm:text-xl"
									onSubmit={onSubmit}
								>
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="name">Name</Label>
										<Input
											type="text"
											id="name"
											name="name"
											placeholder={isEditing ? "Enter name" : user.name}
											readOnly={!isEditing}
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
										></Input>

										{errors.name && (
											<span className="msg-error">{errors.name.message}</span>
										)}
									</div>
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											type="text"
											id="lastName"
											name="lastName"
											placeholder={
												isEditing ? "Enter last name" : user.lastName
											}
											readOnly={!isEditing}
											{...register("lastName", {
												required: isEditing ? "Empty Field" : false,
												minLength: {
													value: 3,
													message: "Debe tener mínimo 3 caracteres",
												},
											})}
										></Input>

										{errors.lastName && (
											<span className="msg-error">
												{errors.lastName.message}
											</span>
										)}
									</div>

									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="genre">Genre</Label>

										<Input
											readOnly
											id="genre"
											name="genre"
											disabled
											defaultValue={user.genre.genre}
											{...register("genre")}
										></Input>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 absolute top-[27px] -left-[24px] sm:top-[10px] sm:left-10 "
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
											/>
										</svg>
									</div>
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="dateOfBirth">Date of Birth</Label>
										<input
											type="date"
											name="dateOfBirth"
											id="dateOfBirth"
											readOnly
											value={user.dateOfBirth}
											className="text-black rounded outline-none w-[189px] "
											disabled
										/>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 absolute top-[27px] -left-[24px] sm:top-[10px] sm:left-4"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
											/>
										</svg>
									</div>
									{provinces && (
										<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
											<Label htmlFor="city">City</Label>
											<select
												name="city"
												id="city"
												className="select-style w-full"
												value={watch("city")}
												onChange={handleProvinceChange}
												{...(!isEditing && {
													readOnly: true,
													disabled: true,
												})}
												disabled={!isEditing}
												{...register("city", {
													required: isEditing ? "empty field" : false,
												})}
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
									)}
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="country">Country</Label>
										<Input
											type="text"
											id="country"
											name="country"
											placeholder={isEditing ? "Enter country" : user.country}
											readOnly={!isEditing}
											{...register("country", {
												required: isEditing ? "Empty Field" : false,
											})}
										/>
										{errors.country && (
											<span className="msg-error">
												{errors.country.message}
											</span>
										)}
									</div>
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="numberPhone">Number of Phone</Label>
										<Input
											type="number"
											id="numberPhone"
											name="numberPhone"
											placeholder={
												isEditing ? "Enter phone number" : user.numberPhone
											}
											readOnly={!isEditing}
											{...register("numberPhone", {
												required: isEditing ? "Empty Field" : false,
												minLength: {
													value: 9,
													message: "Must have at least 9 characters",
												},
											})}
										/>

										{errors.numberPhone && (
											<span className="msg-error">
												{errors.numberPhone.message}
											</span>
										)}
									</div>
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="numberDocument">Number of Document</Label>
										<Input
											type="number"
											id="numberDocument"
											name="numberDocument"
											placeholder={user.numberDocument}
											readOnly={!isEditing}
											disabled
										/>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 absolute top-[50px] -left-[24px] sm:top-[68px] sm:-left-[20px]"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
											/>
										</svg>
									</div>
									<div className="relative mt-2 grid place-items-center scale-75 mr-[22%] sm:mr-0">
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
											{...register("image")}
											disabled={!isEditing}
										/>

										{errors.image && (
											<span className="msg-error">{errors.image.message}</span>
										)}
									</div>
									{typeAccount && (
										<>
											<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
												<Label htmlFor="vehicleType">Type Vehicle</Label>
												<Input
													type="text"
													placeholder="Vehicle"
													name="vehicleType"
													id="vehicleType"
													className="placeholder:pb-20 text-black outline-none rounded pl-1 pr-1"
													{...(!isEditing
														? {
																value: user.vehicleType,
																readOnly: true,
																disabled: true,
														  }
														: {
																placeholder: user.vehicleType,
														  })}
													{...register("vehicleType", {
														required: isEditing ? "Empty Field" : false,
														minLength: {
															value: 10,
															message: "Must have at least 10 characters",
														},
													})}
												/>

												{errors.vehicleType && (
													<span className="msg-error">
														{errors.vehicleType.message}
													</span>
												)}
											</div>
											<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
												<Label htmlFor="workingHours">Working Hours</Label>
												<select
													name="workingHours"
													id="workingHours"
													className="select-style w-full "
													defaultValue={user.workingHours.id} // Establece el valor predeterminado
													disabled={!isEditing} // Deshabilita el select si no está en modo de edición
													{...register("workingHours", {
														required: "Empty Field",
													})}
												>
													<option value="2">Morning: 06am - 12pm</option>
													<option value="3">Noon: 12pm - 18pm</option>
													<option value="4">Night: 18pm - 00am</option>
												</select>
												{errors.workingHours && (
													<span className="msg-error">
														{errors.workingHours.message}
													</span>
												)}
											</div>
											<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
												<Label htmlFor="methodOfPayment">Method of Pay</Label>
												<select
													name="methodOfPayment"
													id="methodOfPayment"
													className="select-style w-full "
													defaultValue={user.methodOfPayment.id} // Establece el valor predeterminado
													disabled={!isEditing} // Deshabilita el select si no está en modo de edición
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
											<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
												<Label htmlFor="state">State</Label>
												<select
													name="state"
													id="state"
													className="select-style w-full "
													defaultValue={user.state.id} // Establece el valor predeterminado
													disabled={!isEditing} // Deshabilita el select si no está en modo de edición
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
													<span className="msg-error">
														{errors.state.message}
													</span>
												)}
											</div>
										</>
									)}
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="email">Email</Label>
										<Input
											type="email"
											placeholder="Email"
											name="email"
											id="email"
											value={user.email}
											readOnly
											disabled
										/>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 absolute top-[27px] -left-[24px] sm:top-[10px] sm:left-10"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
											/>
										</svg>
										{errors.email && (
											<span className="msg-error">{errors.email.message}</span>
										)}
									</div>
									<div className="scale-75 relative max-w-[200px] sm:max-w-[50%] w-[78%]">
										<Label htmlFor="password">Password</Label>
										<Input
											type="password"
											placeholder="Password"
											id="password"
											value={user.password}
											readOnly
											disabled
										/>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6 absolute top-[27px] -left-[24px] sm:top-[10px] sm:left-8"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
											/>
										</svg>
									</div>
									<div className="mt-5 text-center col-span-2">
										<div>
											{errorsBack[0] &&
												errorsBack[0].error.map((error, i) => {
													return (
														<p key={i} className="msg-error mb-1 text-lg">
															`{error.path[i]} : {error.message}`
														</p>
													);
												})}
										</div>
										{isEditing && (
											<Button type="submit">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1.5}
													stroke="currentColor"
													className="w-6 h-6 mx-auto"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
													/>
												</svg>
											</Button>
										)}
									</div>
								</form>

								<div className="float-right p-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5"
										onClick={() => setEditing(true)}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
										/>
									</svg>
								</div>
							</div>
						</>
					) : (
						<div className="text-center p-10 text-xl">
							<h2>Loading</h2>
							<RiLoader2Fill />
						</div>
					)}
				</div>
				<div className="-mt-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className={
							"w-6 h-6 mx-auto transition-all text-white scale-x-150 scale-y-105" +
							(slide ? " rotate-180" : "")
						}
						onClick={() => setSlide(!slide)}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
						/>
					</svg>
				</div>
				{slide && (
					<>
						<div className="conteinerCard-profile">
							<h2>Chats ?</h2>
						</div>
						<div className="conteinerCard-profile">
							<h2>Historial ?</h2>
						</div>
					</>
				)}
			</div>
		</main>
	);
}

/*
rombo {
  width 100
  h100
  bg
  transform: rotate(45deg) skewX(10deg) skewY(10deg)
}
*/

export default Profile;
