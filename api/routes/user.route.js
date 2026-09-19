import express from "express";
import {
  getMatchingProfiles,
  getUser,
  getUsers,
  updateUser,
  createBookedPackage,
  getUserPackage,
  uploadUserImage,
  getMatchingUsers,
  updateUserStatus,
  createInterested,
  toggleInterestedProfile,
  getInterestedProfiles,
  getRandomSingleProfiles,
  getAllFeaturedProfiles,
  getUserNotifications,
  markNotificationsAsRead,
  getUnreadNotificationCount,
  getGuestSearchProfiles
} from "../controllers/user.controller.js";

import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Get all interested profiles for a user
router.get("/interested-profiles/:userId", getInterestedProfiles);
// Toggle interested profile (heart icon)
router.post("/interested-profile", toggleInterestedProfile);


// ===== Ensure "uploads/receipts" directory exists =====
const receiptsDir = path.join(process.cwd(), "uploads", "receipts");
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
  console.log("Created directory: uploads/receipts");
}

// ===== Ensure "uploads/userimg" directory exists =====
const userImgDir = path.join(process.cwd(), "uploads", "userimg");
if (!fs.existsSync(userImgDir)) {
  fs.mkdirSync(userImgDir, { recursive: true });
  console.log("Created directory: uploads/userimg");
}

// ===== Multer Storage Configs =====

// Receipt storage
const receiptsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, receiptsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// User image storage
const userImgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads', 'userimg'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadUserImg = multer({ 
  storage: userImgStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).fields([
  { name: 'profile_img', maxCount: 1 },
  { name: 'img_1', maxCount: 1 },
  { name: 'img_2', maxCount: 1 },
  { name: 'chart_img', maxCount: 1 }
]);


const uploadReceipt = multer({ 
  storage: receiptsStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});



// ===== Routes =====

// Receipt image upload route
router.post(
  "/booked-packages",
  uploadReceipt.single("recipt_img"),
  createBookedPackage
);



// Other user routes
router.put("/update/:id", uploadUserImg, updateUser);
router.get("/getuser/:id", getUser);
router.get("/matching-profiles/:userId", getMatchingProfiles);
router.get("/featured", getRandomSingleProfiles);
router.get("/all-featured", getAllFeaturedProfiles);
router.get("/users", getUsers);
router.get("/matchingusers", getMatchingUsers);
router.get("/user-pkg/:id", getUserPackage);
router.put("/:id/status", updateUserStatus);
router.post("/interested", createInterested);
router.get("/notifications/:userId", getUserNotifications);
router.put("/mark-notifications-read/:userId", markNotificationsAsRead);
router.get("/unread-notifications-count/:userId", getUnreadNotificationCount);
router.get("/guest-search-profiles", getGuestSearchProfiles);

export default router;
