import db from "../utils/dbconfig.js";
import fs from "fs";
import path from "path";

// Schema management is now centralized in api/Database/viwaaha_backup.sql


export const getSuccessStories = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id, 
        CONCAT_WS(' & ', NULLIF(partner1_name, ''), NULLIF(partner2_name, '')) AS couple_name, 
        quote AS feedback, 
        CONCAT_WS(' ', NULLIF(marriage_month, ''), NULLIF(marriage_year, '')) AS wedding_date, 
        location, 
        photo AS image_path, 
        IF(status = 'Published', 1, 0) AS is_active 
      FROM success_stories 
      WHERE status = 'Published' 
      ORDER BY created_at DESC
    `);
    res.status(200).json({ success: true, stories: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllSuccessStories = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        id, 
        CONCAT_WS(' & ', NULLIF(partner1_name, ''), NULLIF(partner2_name, '')) AS couple_name, 
        quote AS feedback, 
        CONCAT_WS(' ', NULLIF(marriage_month, ''), NULLIF(marriage_year, '')) AS wedding_date, 
        location, 
        photo AS image_path, 
        IF(status = 'Published', 1, 0) AS is_active 
      FROM success_stories 
      ORDER BY created_at DESC
    `);
    res.status(200).json({ success: true, stories: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSuccessStory = async (req, res) => {
  try {
    const { couple_name = "", feedback = "", wedding_date = "", location = "" } = req.body;
    let image_path = req.file ? `success-stories/${req.file.filename}` : null;

    let partner1_name = couple_name;
    let partner2_name = "";
    if (couple_name.includes("&")) {
      const parts = couple_name.split("&");
      partner1_name = parts[0].trim();
      partner2_name = parts[1].trim();
    }

    let marriage_month = wedding_date;
    let marriage_year = "";
    if (wedding_date.includes(" ")) {
      const parts = wedding_date.split(" ");
      marriage_month = parts[0].trim();
      marriage_year = parts[1].trim();
    }

    const [result] = await db.execute(
      "INSERT INTO success_stories (partner1_name, partner2_name, quote, marriage_month, marriage_year, location, photo, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Published')",
      [partner1_name, partner2_name, feedback, marriage_month, marriage_year, location, image_path]
    );

    res.status(201).json({ success: true, id: result.insertId, message: "Story added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { couple_name = "", feedback = "", wedding_date = "", location = "" } = req.body;
    
    // Get current story for image cleanup if new one uploaded
    const [current] = await db.execute("SELECT photo FROM success_stories WHERE id = ?", [id]);
    let image_path = current[0]?.photo;

    if (req.file) {
      if (image_path && image_path.includes("success-stories/")) {
        const oldPath = path.join(process.cwd(), "uploads", image_path);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image_path = `success-stories/${req.file.filename}`;
    }

    let partner1_name = couple_name;
    let partner2_name = "";
    if (couple_name.includes("&")) {
      const parts = couple_name.split("&");
      partner1_name = parts[0].trim();
      partner2_name = parts[1].trim();
    }

    let marriage_month = wedding_date;
    let marriage_year = "";
    if (wedding_date.includes(" ")) {
      const parts = wedding_date.split(" ");
      marriage_month = parts[0].trim();
      marriage_year = parts[1].trim();
    }

    await db.execute(
      "UPDATE success_stories SET partner1_name = ?, partner2_name = ?, quote = ?, marriage_month = ?, marriage_year = ?, location = ?, photo = ? WHERE id = ?",
      [partner1_name, partner2_name, feedback, marriage_month, marriage_year, location, image_path, id]
    );

    res.status(200).json({ success: true, message: "Story updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const [current] = await db.execute("SELECT photo FROM success_stories WHERE id = ?", [id]);
    
    if (current[0]?.photo) {
      if (current[0].photo.includes("success-stories/")) {
        const oldPath = path.join(process.cwd(), "uploads", current[0].photo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await db.execute("DELETE FROM success_stories WHERE id = ?", [id]);
    res.status(200).json({ success: true, message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
