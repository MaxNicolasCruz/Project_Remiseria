import fs from "fs";
export const validate = (data) => async (req, res, next) => {
	try {
		await data.parseAsync(req.body);
		next();
	} catch (error) {
		if (req.file) {
			
		fs.unlink(req.file.path, (err) => {
			if (err) {
				console.error("Error al borrar la imagen:", err);
			} else {
				console.log("Imagen borrada correctamente");
			}
		});
		}
		return res.status(400).json({ error: error.errors.map((error) => error) });
	}
};
