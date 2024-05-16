import { createToken } from "../libs/jwt.js";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";
import { Order } from "../models/Order.js";
import { Chat } from "../models/Chat.js";
import { Op, where } from "sequelize";
import { Timetable } from "../models/Timetable.js";
import { Comment } from "../models/Comment.js";

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
		} = req.body;
		//encrypt to password in passwordHash
		let passwordHash = await bcrypt.hash(password, 10);
		try {
			const user = await Client.create({
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
			});

			const token = await createToken({
				id: user.id,
				email: user.email,
				type: "client",
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
		const userFound = await Client.findOne({
			where: {
				email: email,
			},
		});

		if (!userFound)
			return res
				.status(404)
				.json({ message: "email does not correspond to any account" });

		try {
			// descrypt to password in passwordHash
			let passwordIsMatch = await bcrypt.compare(
				password.trim(),
				userFound.password
			);
			if (!passwordIsMatch)
				return res.status(400).json({ message: "password is incorrect" });

			const token = await createToken({
				id: userFound.id,
				email: userFound.email,
				type: "client",
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
		const { name, lastName, city, country, numberPhone, description } =
			req.body;

		const userFound = await Client.findOne({
			where: {
				id: req.user.id,
				email: req.user.email, // Agrega la condición para el campo email
			},
		});
		if (!userFound) return res.status(400).json({ message: "user not found" });

		Client.update(
			{
				name: name,
				last_name: lastName,
				city: city,
				country: country,
				number_phone: numberPhone,
				description: description,
				image: req.file ? req.file.filename : userFound.image,
			},
			{
				where: {
					id: req.user.id,
				},
			}
		);
		res.status(200).json({ message: "update correct" });
	},
	deleteUser: (req, res) => {},
	getUser: async (req, res) => {
		const userFound = await Client.findOne({
			where: {
				id: req.user.id,
				email: req.user.email,
			},
		});

		if (!userFound) return res.status(404).json({ message: "User Not Found" });

		let formattedUsers = {
			id: userFound.id,
			email: userFound.email,
			name: userFound.name,
			lastName: userFound.last_name,
			genre: userFound.genre,
			dateOfBirth: userFound.date_of_birth,
			city: userFound.city,
			country: userFound.country,
			numberPhone: userFound.number_phone,
			numberDocument: userFound.number_document,
			image: `http://localhost:3000/uploads/${userFound.image}`,
		};

		return res.json({
			data: formattedUsers,
			metadata: {
				totalCount: formattedUsers.length,
				timestamp: new Date(),
				url: `http://localhost:3000/api/client/user/${formattedUsers.id}`,
			},
		});
	},
	getAllUser: async (req, res) => {
		let user = [];
		try {
			const allUser = await Client.findAll({
				attributes: { exclude: ["password", "number_document"] },
			});
			const user = allUser.map((user) => ({
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
				orders: user.orders,
				description: user.description,
			}));
		} catch (error) {
			console.log();
			return res.status(500).json({ message: "internal server error" });
		}

		res.status(200).json({
			data: user,
			metadata: {
				totalCount: user.length,
				timestamp: new Date(),
				url: `http://localhost:3000/api/service/user/${user.id}`,
			},
		});
	},
	getAllChats: async (req, res) => {
		let user = await Client.findByPk(req.user.id);
		if (!user) res.status(401).json({ message: "user not found" });
		try {
			let chats = await Chat.findAll({
				where: {
					[Op.or]: [
						{ id_sender: user.id, sender_type: "client" },
						{ id_receiver: user.id, receiver_type: "client" },
					],
				},
				order: [["date", "ASC"]], // Opcional: Puedes ajustar el orden según tus necesidades
			});

			const groupedChats = {};

			for (const chat of chats) {
				const otherUser =
					chat.id_sender === user.id && chat.sender_type === "client"
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
						type: isSender ? "client" : "service",
						image: isSender
							? `http://localhost:3000/uploads/${user.image}`
							: `http://localhost:3000/uploads/${userData.image}`,
					};
				};

				if (otherUserData) {
					const isSender =
						chat.id_sender === user.id && chat.sender_type === "client";
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
		if (req.user.type === "service")
			return res.status(401).json({ message: "not access" });

		try {
			let orders = await Order.findAll({
				where: {
					id_client: req.user.id,
					type_client: req.user.type,
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
				// console.log(order);
				if (order.type_client === "Client") {
					user = await Client.findOne({
						where: {
							id: order.id_client,
						},
					});
					if (!user) return res.status(404).json({ message: "User Not Found" });

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
				} else {
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
						rating: rating,
					};
				}

				order.id_client = user;

				let comment = await Comment.findOne({
					where: {
						id_order: order.id,
					},
				});

				switch (order.status) {
					case "Enviada":
						data.pending.push({ ...order.dataValues, comment });
						break;

					case "En espera":
						data.waiting.push({ ...order.dataValues, comment });
						break;

					case "Aceptada":
						data.agreed.push({ ...order.dataValues, comment });
						break;

					case "Rechazada":
						data.rejected.push({ ...order.dataValues, comment });
						break;

					case "Realizada":
						data.done.push({ ...order.dataValues, comment });
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
	createReview: async (req, res) => {
		let { comment, rating, order } = req.body;

		if (!(req.user.email === req.body.user.email))
			return res.status(404).json({ message: "User Not Found" });

		let existingOrder = await Comment.findOne({
			where: {
				id_order: order.id,
			},
		});

		if (existingOrder)
			return res
				.status(409)
				.json({ message: "You have already made a comment" });

		try {
			Comment.create({
				comment: comment,
				id_client: order.id_client.id,
				id_service: order.id_service,
				rating: rating,
				id_order: order.id,
			});

			let service = await Service.findByPk(order.id_service);

			if (service.rating == 0) {
				await Service.update(
					{
						rating: rating,
					},
					{
						where: {
							id: service.id,
						},
					}
				);
			} else {
				rating = (service.rating + rating) / 2;
				await Service.update(
					{
						rating: Math.round(rating),
					},
					{
						where: {
							id: service.id,
						},
					}
				);
			}

			res.status(200).json({
				message: "succesfull",
			});
		} catch (error) {
			console.log(error);
			return res.status(404).json({ message: "User Not Found" });
		}
	},
};

export default userMethod;
