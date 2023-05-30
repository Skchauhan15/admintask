import express from "express";
import { authorization } from "../../middlewares";
import * as  controller from "./upload.controller"
const router = express.Router();

router.post("/upload_file", authorization, controller.uploadfiles)

export default router;