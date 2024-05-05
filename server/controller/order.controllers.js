import { Order } from "../models/Order.js";


const userMethod = {
	sendOrder: async (req, res) => {
		if (!req.user) return res.status(401).json({ message: "User not found" });
		console.log(req.user);
		try {
			Order.create({
				id_client: req.user.id,
				id_service: req.body.id,
				method_pay: "Efectivo",
				status: "Enviada",
				type_client: req.user.type,
			});

			res.status(200).json({ message: "successful" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "internal server error" });
		}
	},
};

export default userMethod