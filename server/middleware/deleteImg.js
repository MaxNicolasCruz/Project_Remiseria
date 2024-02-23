import fs from "fs";

export const imgDelete = (req) => {
	if (req.file) {
		fs.unlink(req.file.path, (err) => {
			if (err) {
				console.error("Error al borrar la imagen:", err);
			} else {
				console.log("Imagen borrada correctamente");
			}
		});
	}
};
