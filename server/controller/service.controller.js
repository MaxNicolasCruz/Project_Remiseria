import { createToken } from "../libs/jwt.js";
import { Service } from "../models/Service.js";
import { Timetable } from "../models/Timetable.js";
import { Comment } from "../models/Comment.js";
import { Order } from "../models/Order.js";
import { Client } from "../models/Client.js";
import { imgDelete } from "../middleware/deleteImg.js";
import { Chat } from "../models/Chat.js";
import { Op, or } from "sequelize";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
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
				type: "service",
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
				type: "service",
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
	deleteUser: (req, res) => {},
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
		let allUser = await Service.findAll({
			attributes: { exclude: ["password", "number_document"] },
			include: [
				{
					model: Timetable,
					as: "timetableUser",
					attributes: ["timetable"],
				},
			],
		});

		const { token } = req.cookies;

		if (token) {
			jwt.verify(token, TOKEN_SECRET, (err, user) => {
				if (err) {
					console.log("error", err);
				}
				req.user = user;
			});
		}

		if (req?.user) {
			allUser = allUser.filter((user) => {
				return req.user.id !== user.id || req.user.email !== user.email;
			});
		}

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
			data: [...formattedUsers],
			metadata: {
				totalCount: formattedUsers.length,
				timestamp: new Date(),
				url: `http://localhost:3000/api/service/user/${formattedUsers.id}`,
			},
		});
	},
	getAllChats: async (req, res) => {
		let user = await Service.findByPk(req.user.id);
		if (!user) res.status(401).json({ message: "user not found" });
		try {
			let chats = await Chat.findAll({
				where: {
					[Op.or]: [
						{ id_sender: user.id, sender_type: "service" },
						{ id_receiver: user.id, receiver_type: "service" },
					],
				},
				order: [["date", "ASC"]], // Opcional: Puedes ajustar el orden según tus necesidades
			});

			const groupedChats = {};

			for (const chat of chats) {
				const otherUser =
					chat.id_sender === user.id && chat.sender_type === "service"
						? { id: chat.id_receiver, typeReceiver: chat.receiver_type }
						: { id: chat.id_sender, typeSender: chat.sender_type };
				if (!groupedChats[otherUser.id]) {
					groupedChats[otherUser.id] = [];
				}
				let otherUserData;
				if (
					otherUser.typeReceiver === "client" ||
					otherUser.typeSender === "client"
				) {
					otherUserData = await Client.findByPk(otherUser.id);
				} else if (
					otherUser.typeReceiver === "service" ||
					otherUser.typeSender === "service"
				) {
					otherUserData = await Service.findByPk(otherUser.id);
				}

				const buildUserObject = (id, userData, isSender) => {
					return {
						id: id,
						name: isSender ? user.name : userData.name,
						lastName: isSender ? user.last_name : userData.last_name,
						email: isSender ? user.email : userData.email,

						type: isSender
							? "service"
							: otherUser.typeSender
							? otherUser.typeSender
							: otherUser.typeReceiver,
						image: isSender
							? `http://localhost:3000/uploads/${user.image}`
							: `http://localhost:3000/uploads/${userData.image}`,
					};
				};
				if (otherUserData) {
					const isSender =
						chat.id_sender === user.id && chat.sender_type === "service";
					groupedChats[otherUser.id].push({
						id: chat.id,
						message: chat.message,
						sender: buildUserObject(chat.id_sender, otherUserData, isSender),
						receiver: buildUserObject(
							chat.id_receiver,
							otherUserData,
							!isSender
						),
						date: chat.date,
					});
				}
			}

			return res.status(200).json({
				data: groupedChats,
				metadata: {
					totalCount: Object.keys(groupedChats).length,
					timestamp: new Date(),
				},
			});
		} catch (error) {
			console.log(error);
			return res.status(500).json({ message: "error internal server" });
		}
	},
	getOrder: async (req, res) => {
		if (!req.user) return res.status(401).json({ message: "User not found" });
		try {
			let orders = await Order.findAll({
				where: {
					[Op.or]: [
						{ id_client: req.user.id, type_client: req.user.type },
						{ id_service: req.user.id },
					],
				},
				order: [["date", "DESC"]],
			});

			let data = {
				pending: [],
				waiting: [],
				agreed: [],
				rejected: [],
				done: [],
			};
			for (const order of orders) {
				let user;
				if (order.type_client === "Service") {
					user = await Service.findOne({
						where: {
							id: order.id_client,
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

					if (!user) return res.status(404).json({ message: "User Not Found" });

					let rating = user.Comments.reduce((sum, comment) => {
						return sum + comment.rating;
					}, 0);
					user = {
						id: user.id,
						email: user.email,
						name: user.name,
						lastName: user.last_name,
						genre: user.genre,
						dateOfBirth: user.date_of_birth,
						city: user.city,
						country: user.country,
						numberPhone: user.number_phone,
						image: `http://localhost:3000/uploads/${user.image}`,
						description: user.description,
						rating: rating
					};
				} else {
					user = await Client.findByPk(order.id_client);

					user = {
						id: user.id,
						email: user.email,
						name: user.name,
						lastName: user.last_name,
						genre: user.genre,
						dateOfBirth: user.date_of_birth,
						city: user.city,
						country: user.country,
						numberPhone: user.number_phone,
						numberDocument: user.number_document,
						image: `http://localhost:3000/uploads/${user.image}`,
					};
				}

				order.id_client = user;

				switch (order.status) {
					case "Enviada":
						data.pending.push(order);
						break;
					case "En espera":
						data.waiting.push(order);
						break;
					case "Aceptada":
						data.agreed.push(order);
						break;
					case "Rechazada":
						data.rejected.push(order);
						break;
					case "Realizada":
						data.done.push(order);
						break;
					default:
						break;
				}
			}

			res.status(200).json({
				data,
				metadata: {
					totalCount: Object.keys(data).length,
					timestamp: new Date(),
				},
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "internal server error" });
		}
	},
};

export default userMethod;
