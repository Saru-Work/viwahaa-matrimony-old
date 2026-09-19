import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getSuccessStories,
  getAllSuccessStories,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
} from "../controllers/successStory.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "uploads", "success-stories");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "story-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.get("/active", getSuccessStories);
router.get("/all", getAllSuccessStories);
router.post("/", upload.single("image"), createSuccessStory);
router.put("/:id", upload.single("image"), updateSuccessStory);
router.delete("/:id", deleteSuccessStory);

export default router;
