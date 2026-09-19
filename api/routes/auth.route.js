import express from "express";
import { registerUser, signin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", signin);

export default router;
