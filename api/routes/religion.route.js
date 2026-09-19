import express from "express";
import { getAllReligions } from "../controllers/defaultProfileImage.controller.js";

const router = express.Router();

router.get("/", getAllReligions);

export default router;
