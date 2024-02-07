import { createToken } from "../libs/jwt.js";
import { Service } from "../models/Service.js";
import { Genre } from "../models/Genre.js";
import { State } from "../models/State.js";
import { Timetable } from "../models/Timetable.js";
import { Payment_method } from "../models/Payment_method.js";
import bcrypt from "bcryptjs";

const userMethod = {
	createUser: async (req, res) => {
		//destruturing to req.body
		const {
			email,
			password,
			name,
			lastName,
			genre,
			dateOfBirth,
			city,
			country,
			numberPhone,
			numberDocument,
			vehicleType,
			workingHours,
			methodOfPayment,
			state,
		} = req.body;
		//encrypt to password in passwordHash
		let passwordHash = await bcrypt.hash(password, 10);
		try {
			const user = await Service.create({
				email: email,
				password: passwordHash,
				name: name,
				last_name: lastName,
				genre: genre,
				date_of_birth: dateOfBirth,
				city: city,
				country: country,
				number_phone: parseInt(numberPhone),
				number_document: parseInt(numberDocument),
				image: req.file ? req.file.filename : "default.png",
				vehicle_type: vehicleType,
				working_hours: workingHours,
				method_of_payment: methodOfPayment,
				state: state,
			});
			if (!user) return res.status(401).json("user not create");

			const token = await createToken({
				id: user.id,
				email: serviceFound.email,
			});
			res.cookie("token", token);
			res.json({ message: "successfully" });
		} catch (error) {
			console.log(error);
		}
	},
	loginUser: async (req, res) => {
		//destruturing to req.body
		const { email, password } = req.body;

		const serviceFound = await Service.findOne({
			where: {
				email: email.trim(),
			},
		});
		try {
			if (!serviceFound)
				return res
					.status(404)
					.json({ message: "email does not correspond to any account" });

			// descrypt to password in passwordHash
			let passwordIsMatch = await bcrypt.compare(
				password.trim(),
				serviceFound.password
			);
			if (!passwordIsMatch)
				return res.status(400).json({ message: "password is incorrect" });

			const token = await createToken({
				id: serviceFound.id,
				email: serviceFound.email,
			});
			res.cookie("token", token);
			res.json({
				message: "login correct",
			});
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
	logout: async (req, res) => {
		res.cookie("token", "", {
			expire: new Date(0),
		});
		return res.sendStatus(200);
	},
	updateUser: async (req, res) => {
		try {
			console.log(req.body);
			const {
				name,
				lastName,
				city,
				country,
				numberPhone,
				vehicleType,
				workingHours,
				methodOfPayment,
				state,
			} = req.body;
			const userFound = await Service.findOne({
				where: {
					id: req.user.id,
					email: req.user.email, // Agrega la condición para el campo email
				},
			});
			if (!userFound)
				return res.status(400).json({ message: "user not found" });
			
			Service.update(
				{
					name: name,
					last_name: lastName,
					city: city,
					country: country,
					number_phone: parseInt(numberPhone),
					image: req.file ? req.file.filename : userFound.image,
					vehicle_type: vehicleType,
					working_hours: workingHours,
					method_of_payment: methodOfPayment,
					state: state,
				},
				{
					where: {
						id: req.user.id,
					},
				}
			);

			res.status(200).json(`succesfull ${req.user.id}`);
		} catch (error) {
			console.log(error);
			res.status(400);
		}
	},
	deleteUser: (req, res) => {
		// Client.destroy({
		//     where: {
		//         id:
		//     }
		// })
	},
	getUser: async (req, res) => {
		const serviceFound = await Service.findOne({
			where: {
				id: req.user.id,
				email: req.user.email,
			},
			include: [
				{
					model: Genre, // Reemplaza con el nombre real del modelo
					as: "genreUser",
					attributes: ["id", "genre"], // Reemplaza con el nombre de la columna que deseas seleccionar
				},
				{
					model: State, // Reemplaza con el nombre real del modelo
					as: "stateUser",
					attributes: ["id", "status"], // Reemplaza con el nombre de la columna que deseas seleccionar
				},
				{
					model: Timetable, // Reemplaza con el nombre real del modelo
					as: "timetableUser",
					attributes: ["id", "timetable"], // Reemplaza con el nombre de la columna que deseas seleccionar
				},
				{
					model: Payment_method, // Reemplaza con el nombre real del modelo
					as: "methodUser",
					attributes: ["id", "method"], // Reemplaza con el nombre de la columna que deseas seleccionar
				},
			],
		});
		if (!serviceFound)
			return res.status(404).json({ message: "User Not Found" });

		return res.json({
			id: serviceFound.id,
			email: serviceFound.email,
			name: serviceFound.name,
			lastName: serviceFound.last_name,
			genre: serviceFound.genreUser,
			dateOfBirth: serviceFound.date_of_birth,
			city: serviceFound.city,
			country: serviceFound.country,
			numberPhone: serviceFound.number_phone,
			numberDocument: serviceFound.number_document,
			image: `http://localhost:3000/uploads/${serviceFound.image}`,
			vehicleType: serviceFound.vehicle_type,
			workingHours: serviceFound.timetableUser,
			methodOfPayment: serviceFound.methodUser,
			state: serviceFound.stateUser,
		});
	},
	getAllUser: async (req, res) => {
		const allUser = await Service.findAll({
			attributes: { exclude: ["password", "number_document"] },
			include: [
				{
					model: Genre,
					as: "genreUser",
					attributes: ["genre"],
				},
				{
					model: State,
					as: "stateUser",
					attributes: ["status"],
				},
				{
					model: Timetable,
					as: "timetableUser",
					attributes: ["timetable"],
				},
				{
					model: Payment_method,
					as: "methodUser",
					attributes: ["method"],
				},
			],
		});

		const formattedUsers = allUser.map((user) => ({
			id: user.id,
			email: user.email,
			name: user.name,
			lastName: user.last_name,
			genre: user.genreUser ? user.genreUser.genre : null,
			dateOfBirth: user.date_of_birth,
			numberPhone: user.number_phone,
			city: user.city,
			country: user.country,
			image: `http://localhost:3000/uploads/${user.image}`,
			vehicleType: user.vehicle_type,
			workingHours: user.timetableUser ? user.timetableUser.timetable : null,
			methodOfPayment: user.methodUser ? user.methodUser.method : null,
			orders: user.orders,
			rating: user.rating,
			state: user.stateUser ? user.stateUser.status : null,
		}));

		res.json({
			users: formattedUsers,
		});
	},
};

export default userMethod;
