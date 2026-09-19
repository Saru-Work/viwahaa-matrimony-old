import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getDefaultProfileImages,
  createDefaultProfileImage,
  deleteDefaultProfileImage
} from "../controllers/defaultProfileImage.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "uploads", "default-profiles");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "default-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get("/", getDefaultProfileImages);
router.post("/", upload.single("image"), createDefaultProfileImage);
router.delete("/:id", deleteDefaultProfileImage);

export default router;
