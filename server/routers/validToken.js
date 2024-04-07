import Router from "express";
const router = Router();
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { Client } from "../models/Client.js";
import { Service } from "../models/Service.js";

router.get("/", async (req, res) => {
	const { token } = req.cookies;
	if (!token) return res.status(401).json({ message: "Unauthorized" });

	jwt.verify(token, TOKEN_SECRET, async (err, user) => {
		if (err) return res.status(401).json({ message: "Unauthorized" });
		const { id, email, type } = user;

		let foundUser = null;
		
		if (type === "client") {
			foundUser = await Client.findOne({
				where: {
					id,
					email,
				},
			});
		} else if (type === "service") {
			foundUser = await Service.findOne({
				where: {
					id,
					email,
				},
			});
		}
		
		if (!foundUser) return res.status(401).json({ message: "not found" });

		return res.json({
			id: foundUser.id,
			email: foundUser.email,
			type: type
		});
	});
});

export default router;
