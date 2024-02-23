import { createToken } from "../libs/jwt.js";
import { Client } from "../models/Client.js";
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
		});

		if (!userFound) return res.status(404).json({ message: "User Not Found" });

		return res.json({
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
		});
	},
	getAllUser: async (req, res) => {
		let user = []
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
			return res.status(500).json({message: 'internal server error'})
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
};

export default userMethod;
