import db from "../utils/dbconfig.js";
import fs from "fs";
import path from "path";

// Schema management is now centralized in api/Database/viwaaha_backup.sql


export const getWeddingGallery = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM wedding_gallery WHERE is_active = TRUE ORDER BY display_order ASC, created_at DESC");
    res.status(200).json({ success: true, images: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllWeddingGallery = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM wedding_gallery ORDER BY display_order ASC, created_at DESC");
    res.status(200).json({ success: true, images: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addWeddingImage = async (req, res) => {
  try {
    const { couple_name, display_order } = req.body;
    if (!req.file) return res.status(400).json({ success: false, error: "Image is required" });

    const image_path = `wedding-gallery/${req.file.filename}`;

    const [result] = await db.execute(
      "INSERT INTO wedding_gallery (couple_name, image_path, display_order) VALUES (?, ?, ?)",
      [couple_name, image_path, display_order || 0]
    );

    res.status(201).json({ success: true, id: result.insertId, message: "Image added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateWeddingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { couple_name, display_order, is_active } = req.body;

    // Get current values to avoid overwriting with undefined
    const [current] = await db.execute("SELECT * FROM wedding_gallery WHERE id = ?", [id]);
    if (current.length === 0) return res.status(404).json({ success: false, error: "Image not found" });

    const updatedCoupleName = couple_name !== undefined ? couple_name : current[0].couple_name;
    const updatedDisplayOrder = display_order !== undefined ? display_order : current[0].display_order;
    const updatedIsActive = is_active !== undefined ? is_active : current[0].is_active;

    await db.execute(
      "UPDATE wedding_gallery SET couple_name = ?, display_order = ?, is_active = ? WHERE id = ?",
      [updatedCoupleName, updatedDisplayOrder, updatedIsActive, id]
    );

    res.status(200).json({ success: true, message: "Image updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteWeddingImage = async (req, res) => {
  try {
    const { id } = req.params;
    const [current] = await db.execute("SELECT image_path FROM wedding_gallery WHERE id = ?", [id]);
    
    if (current[0]?.image_path) {
      const oldPath = path.join(process.cwd(), "uploads", current[0].image_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await db.execute("DELETE FROM wedding_gallery WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
