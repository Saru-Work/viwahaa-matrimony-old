import express from "express";
import {
  getAllDiscountPackages,
  getDiscountPackage,
  createDiscountPackage,
  updateDiscountPackage,
  deleteDiscountPackage,
} from "../controllers/discountPackage.controller.js";

const router = express.Router();
router.get("/", getAllDiscountPackages);
router.get("/:id", getDiscountPackage);
router.post("/", createDiscountPackage);
router.put("/:id", updateDiscountPackage);
router.delete("/:id", deleteDiscountPackage);

export default router;
