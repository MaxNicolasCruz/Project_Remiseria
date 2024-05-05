import Router from "express";
import { registerService, updateService } from "../libs/validateZod.js";
import { authRequired } from "../middleware/validateToken.js";
import { fileUpload } from "../libs/multer.js";
const router = Router();

import methodOrder from "../controller/order.controllers.js";

router.post("/sendOrder", authRequired, methodOrder.sendOrder);


export default router;
