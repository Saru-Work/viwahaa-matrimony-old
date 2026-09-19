import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getWeddingGallery,
  getAllWeddingGallery,
  addWeddingImage,
  updateWeddingImage,
  deleteWeddingImage,
} from "../controllers/weddingGallery.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "uploads", "wedding-gallery");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "wedding-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get("/active", getWeddingGallery);
router.get("/all", getAllWeddingGallery);
router.post("/", upload.single("image"), addWeddingImage);
router.put("/:id", updateWeddingImage);
router.delete("/:id", deleteWeddingImage);

export default router;
