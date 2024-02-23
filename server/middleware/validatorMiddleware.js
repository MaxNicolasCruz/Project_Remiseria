import { imgDelete } from "../middleware/deleteImg.js";

export const validate = (data) => async (req, res, next) => {
	try {
		await data.parseAsync(req.body);
		next();
	} catch (error) {
		imgDelete(req)
		return res.status(400).json({ error: error.errors.map((error) => error) });
	}
};
