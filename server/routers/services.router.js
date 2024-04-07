import Router from "express";
import { validate } from "../middleware/validatorMiddleware.js";
import { registerService, updateService } from "../libs/validateZod.js";
import { authRequired } from "../middleware/validateToken.js";
import { fileUpload } from "../libs/multer.js";
const router = Router();

import methodServices from "../controller/service.controller.js";

router.post(
	"/register",
	fileUpload.single("image"),
	validate(registerService),
	methodServices.createUser
);
router.post("/login", methodServices.loginUser);
router.post("/logout", authRequired, methodServices.logout);
router.patch(
	"/update",
	fileUpload.single("image"),
	authRequired,
	validate(updateService),
	methodServices.updateUser
);
router.delete("/delete", methodServices.deleteUser);
router.get("/profile", authRequired, methodServices.profile);
router.get("/user/:id", authRequired, methodServices.getUser);
router.get("/getUsers", methodServices.getAllUser);
router.get("/getChats", authRequired, methodServices.getAllChats);

export default router;
