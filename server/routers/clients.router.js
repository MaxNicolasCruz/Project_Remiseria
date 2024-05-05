import Router from "express";
import { validate } from "../middleware/validatorMiddleware.js";
import { registerClient, updateClient } from "../libs/validateZod.js";
import { authRequired } from "../middleware/validateToken.js";
import { fileUpload } from "../libs/multer.js";
const router = Router();

import userMethod from "../controller/clients.controller.js";

//rutas
router.post(
	"/register",
	fileUpload.single("image"),
	validate(registerClient),
	userMethod.createUser
);
router.post("/login", userMethod.loginUser);
router.post("/logout", userMethod.logout);
router.patch(
	"/update",
	fileUpload.single("image"),
	authRequired,
	validate(updateClient),
	userMethod.updateUser
);
router.delete("/delete", authRequired, userMethod.deleteUser);
router.get("/profile", authRequired, userMethod.getUser);
router.get("/getUsers", userMethod.getAllUser);
router.get("/getChats", authRequired, userMethod.getAllChats);
router.get("/getOrder", authRequired, userMethod.getOrder);

export default router;
