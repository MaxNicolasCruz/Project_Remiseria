import { createToken } from "../libs/jwt.js";
import { Client } from "../models/Client.js";
import bcrypt from "bcryptjs";
import { Genre } from "../models/Genre.js";

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
		console.log(req.body);
		let passwordHash = await bcrypt.hash(password, 10);
		try {
			const user = await Client.create({
				email: email,
				password: passwordHash,
				name: name,
				last_name: lastName,
				genre: parseInt(genre),
				date_of_birth: dateOfBirth,
				city: city,
				country: country,
				number_phone: parseInt(numberPhone),
				number_document: parseInt(numberDocument),
				image: req.file ? req.file.filename : "default.png",
			});

			const token = await createToken({
				id: userFound.id,
				email: userFound.email,
			});
			res.cookie("token", token);
			res.json({ message: "successfully" });
		} catch (error) {
			console.log(error);
		}
	},
	loginUser: async (req, res) => {
		//destruturing to req.body
		console.log(req.body);
		const { email, password } = req.body;
		const userFound = await Client.findOne({
			where: {
				email: email,
			},
		});
		try {
			if (!userFound)
				return res
					.status(404)
					.json({ message: "email does not correspond to any account" });

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
		const {
			name,
			lastName,
			dateOfBirth,
			city,
			country,
			numberPhone
		} = req.body;
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
				image: req.file ? req.file.filename : userFound.image,
			},
			{
				where: {
					id: req.user.id,
				},
			}
		);
	},
	deleteUser: (req, res) => {
		// Client.destroy({
		//     where: {
		//         id:
		//     }
		// })
	},
	getUser: async (req, res) => {
		const userFound = await Client.findOne({
			where: {
				id: req.user.id,
				email: req.user.email, // Agrega la condición para el campo email
			},
			include: [
				{
					model: Genre,
					as: "genreUser",
					attributes: ["genre"],
				},
			],
		});

		if (!userFound) return res.status(404).json({ message: "User Not Found" });

		return res.json({
			id: userFound.id,
			email: userFound.email,
			name: userFound.name,
			lastName: userFound.last_name,
			genre: userFound.genreUser,
			dateOfBirth: userFound.date_of_birth,
			city: userFound.city,
			country: userFound.country,
			numberPhone: userFound.number_phone,
			numberDocument: userFound.number_document,
			image: `http://localhost:3000/uploads/${userFound.image}`,
		});
	},
	getAllUser: (req, res) => {
		res.send("all clients");
	},
};

export default userMethod;
