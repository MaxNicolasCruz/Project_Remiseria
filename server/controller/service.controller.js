import { createToken } from "../libs/jwt.js";
import { Service } from "../models/Service.js";
import { Timetable } from "../models/Timetable.js";
import { Comment } from "../models/Comment.js";
import { Order } from "../models/Order.js";
import { Client } from "../models/Client.js";
import { imgDelete } from "../middleware/deleteImg.js";

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
				email: user.email,
			});
			res.cookie("token", token);
			res.status(201).json({ message: "successfully" });
		} catch (error) {
			imgDelete(req);
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
		if (!serviceFound)
			return res
				.status(404)
				.json({ message: "email does not correspond to any account" });
		try {
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
				description,
			} = req.body;
			const userFound = await Service.findOne({
				where: {
					id: req.user.id,
					email: req.user.email, // Agrega la condición para el campo email
				},
			});
			if (!userFound)
				return res.status(400).json({ message: "user not found" });
			await Service.update(
				{
					name: name,
					last_name: lastName,
					city: city,
					country: country,
					number_phone: parseInt(numberPhone, 10),
					image: req.file ? req.file.filename : userFound.image,
					vehicle_type: vehicleType,
					working_hours: workingHours,
					method_of_payment: methodOfPayment,
					state: state,
					description: description,
				},
				{
					where: {
						id: req.user.id,
					},
				}
			);

			res.status(201).json(`succesfull ${req.user.id}`);
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "internal server error" });
		}
	},
	deleteUser: (req, res) => {
		// Client.destroy({
		//     where: {
		//         id:
		//     }
		// })
	},
	profile: async (req, res) => {
		const serviceFound = await Service.findOne({
			where: {
				id: req.user.id,
				email: req.user.email,
			},
			include: [
				{
					model: Timetable,
					as: "timetableUser",
					attributes: ["id", "timetable"],
				},
				{
					model: Order,
					attributes: ["id", "date", "method_pay", "status"],
					include: [
						{
							model: Client,
							attributes: ["name", "last_name"],
						},
						{
							model: Service,
							attributes: ["name", "last_name"],
						},
					],
				},
			],
		});
		if (!serviceFound)
			return res.status(404).json({ message: "User Not Found" });

		let formattedUser = {
			id: serviceFound.id,
			email: serviceFound.email,
			name: serviceFound.name,
			lastName: serviceFound.last_name,
			genre: serviceFound.genre,
			dateOfBirth: serviceFound.date_of_birth,
			city: serviceFound.city,
			country: serviceFound.country,
			numberPhone: serviceFound.number_phone,
			numberDocument: serviceFound.number_document,
			image: `http://localhost:3000/uploads/${serviceFound.image}`,
			vehicleType: serviceFound.vehicle_type,
			workingHours: serviceFound.timetableUser,
			methodOfPayment: serviceFound.method_of_payment,
			state: serviceFound.state,
			rating: serviceFound.rating,
			orders: serviceFound.Orders,
			description: serviceFound.description,
		};
		return res.json({
			data: formattedUser,
			metadata: {
				timestamp: new Date(),
				url: `http://localhost:3000/api/service/profile`,
			},
		});
	},
	getUser: async (req, res) => {
		const serviceFound = await Service.findOne({
			where: {
				id: req.params.id,
			},
			include: [
				{
					model: Timetable,
					as: "timetableUser",
					attributes: ["id", "timetable"],
				},
				{
					model: Order,
					attributes: ["id", "date", "method_pay", "status"],
					include: [
						{
							model: Client,
							attributes: ["name", "last_name"],
						},
						{
							model: Service,
							attributes: ["name", "last_name"],
						},
					],
				},
				{
					model: Comment,
					attributes: ["id", "comment", "rating"],
					include: [
						{
							model: Client,
							attributes: ["name", "last_name"],
						},
						{
							model: Service,
							attributes: ["name", "last_name"],
						},
					],
				},
			],
		});
		if (!serviceFound)
			return res.status(404).json({ message: "User Not Found" });
		// return res.json(serviceFound)
		let rating = serviceFound.Comments.reduce((sum, comment) => {
			return sum + comment.rating;
		}, 0);
		
		let formattedUser = {
			id: serviceFound.id,
			email: serviceFound.email,
			name: serviceFound.name,
			lastName: serviceFound.last_name,
			genre: serviceFound.genre,
			dateOfBirth: serviceFound.date_of_birth,
			city: serviceFound.city,
			country: serviceFound.country,
			numberPhone: serviceFound.number_phone,
			image: `http://localhost:3000/uploads/${serviceFound.image}`,
			vehicleType: serviceFound.vehicle_type,
			workingHours: serviceFound.timetableUser.timetable,
			methodOfPayment: serviceFound.method_of_payment,
			state: serviceFound.state,
			rating: rating / serviceFound.Comments.length,
			description: serviceFound.description,
			orders: serviceFound.Orders,
			comments: serviceFound.Comments,
		};
		return res.json({
			data: { formattedUser },
			metadata: {
				timestamp: new Date(),
				url: `http://localhost:3000/api/service/user/${serviceFound.id}`,
			},
		});
	},
	getAllUser: async (req, res) => {
		const allUser = await Service.findAll({
			attributes: { exclude: ["password", "number_document"] },
			include: [
				{
					model: Timetable,
					as: "timetableUser",
					attributes: ["timetable"],
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
			description: user.description,
		}));

		res.json({
			data: formattedUsers,
			metadata: {
				totalCount: formattedUsers.length,
				timestamp: new Date(),
				url: `http://localhost:3000/api/service/user/${formattedUsers.id}`,
			},
		});
	},
};

export default userMethod;
