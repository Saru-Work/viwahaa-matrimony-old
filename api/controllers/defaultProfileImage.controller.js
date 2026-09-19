import db from "../utils/dbconfig.js";
import fs from "fs";
import path from "path";

// Schema management is now centralized in api/Database/viwaaha_backup.sql


// Get all default profile images with religion names
export const getDefaultProfileImages = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT di.id, di.gender, di.image_path, di.religion_id, r.name as religion_name 
      FROM default_profile_images di
      JOIN religions r ON di.religion_id = r.id
      ORDER BY di.gender, r.name
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create or update a default profile image
export const createDefaultProfileImage = async (req, res) => {
  try {
    const { religion_id, gender } = req.body;
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image" });
    }

    const image_path = `default-profiles/${req.file.filename}`;

    // Check if an image already exists for this combo to delete the old file
    const [existing] = await db.execute(
      "SELECT image_path FROM default_profile_images WHERE religion_id = ? AND gender = ?",
      [religion_id, gender]
    );

    if (existing.length > 0) {
      const oldPath = path.join(process.cwd(), "uploads", existing[0].image_path);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) {
          console.error("Error deleting old file:", err);
        }
      }

      await db.execute(
        "UPDATE default_profile_images SET image_path = ? WHERE religion_id = ? AND gender = ?",
        [image_path, religion_id, gender]
      );
    } else {
      await db.execute(
        "INSERT INTO default_profile_images (religion_id, gender, image_path) VALUES (?, ?, ?)",
        [religion_id, gender, image_path]
      );
    }

    res.status(201).json({ success: true, message: "Default profile image saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a default profile image
export const deleteDefaultProfileImage = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute("SELECT image_path FROM default_profile_images WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    const image_path = rows[0].image_path;
    const fullPath = path.join(process.cwd(), "uploads", image_path);

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    await db.execute("DELETE FROM default_profile_images WHERE id = ?", [id]);

    res.status(200).json({ success: true, message: "Default profile image deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Help controller to get all religions
export const getAllReligions = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM religions ORDER BY name");
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
