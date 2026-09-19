import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getAllHeroImages,
  getActiveHeroImages,
  uploadHeroImage,
  deleteHeroImage,
  toggleHeroImage,
  updateHeroImageOrder,
  updatePositionY,
  updateZoom,
} from "../controllers/heroImage.controller.js";

const router = express.Router();

// Configure multer storage for hero images
const heroStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "uploads", "hero");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "hero-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: heroStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for hero images
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, webp) are allowed"));
    }
  },
});

// Public route - get active hero images for the homepage
router.get("/active", getActiveHeroImages);

// Admin routes
router.get("/", getAllHeroImages);
router.post("/", upload.single("image"), uploadHeroImage);
router.delete("/:id", deleteHeroImage);
router.put("/:id/toggle", toggleHeroImage);
router.put("/:id/position", updatePositionY);
router.put("/:id/zoom", updateZoom);
router.put("/order", updateHeroImageOrder);

export default router;
