import express from "express";
import methodOverride from "method-override";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url"; // Importa fileURLToPath de url
import path from "path";
import cors from "cors";

// importacion de rutas
import routeClient from "./routers/clients.router.js";
import routeService from "./routers/services.router.js";
import routeToken from "./routers/validToken.js";

const app = express();

//Definir carpeta estatica
const __filename = fileURLToPath(import.meta.url); // Obtén el nombre de archivo
const __dirname = path.dirname(__filename); // Obtén el directorio

//middlewares
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use("/uploads", express.static(path.join(__dirname, "./public/img")));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

//routes
app.use("/api/client", routeClient);
app.use("/api/service", routeService);
app.use("/api/validToken", routeToken);

export default app;
