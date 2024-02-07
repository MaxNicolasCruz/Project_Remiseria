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
		const { id, email } = user;
		const FoundClient = await Client.findOne({
			where: {
				id,
				email,
			},
		});

		if (!FoundClient) {
			const FoundService = await Service.findOne({
				where: {
					id,
					email,
				},
			});

			if (!FoundService)
				return res.status(401).json({ message: "Unauthorized" });
			return res.json({
				id: FoundService.id,
				email: FoundService.email
			});
		}
		return res.json({
			id: FoundClient.id,
			email: FoundClient.email
		});
	});
});

export default router;
