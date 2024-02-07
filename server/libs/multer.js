import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Obtener la ruta del directorio actual utilizando import.meta.url
const currentFileUrl = import.meta.url;
// Convertir la URL del archivo a la ruta del sistema de archivos
const currentFilePath = fileURLToPath(currentFileUrl);
// Obtener el directorio del archivo actual
const currentDir = path.dirname(currentFilePath);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const destinationPath = path.join(currentDir, "..", "public", "img");
		cb(null, destinationPath);
	},
	filename: (req, file, cb) => {
		let newFileName = "user-" + Date.now() + path.extname(file.originalname);
		cb(null, newFileName);
	},
});

export let fileUpload = multer({ storage: storage });
