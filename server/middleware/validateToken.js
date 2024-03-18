import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
	const { token } = req.cookies;
    console.log(token);
	if (!token)
		return res
			.status(401)
			.json({ message: "no token, authorization deniged " });

	jwt.verify(token, TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log(err);
			return res.status(403).json({ message: "invalid token" });
		}
		req.user = user;

		next();
	});
};
