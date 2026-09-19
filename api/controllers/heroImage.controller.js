import db from "../utils/dbconfig.js";
import fs from "fs";
import path from "path";

// Schema management is now centralized in api/Database/viwaaha_backup.sql


// Get all hero images (admin)
export const getAllHeroImages = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM hero_images ORDER BY display_order ASC, created_at DESC",
    );
    res.status(200).json({ success: true, images: rows });
  } catch (error) {
    console.error("Get hero images error:", error);
    res.status(500).json({ error: "Failed to fetch hero images" });
  }
};

// Get active hero images (public - for the NewHome page)
export const getActiveHeroImages = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, image_path, display_order, position_y, zoom FROM hero_images WHERE is_active = 1 ORDER BY display_order ASC",
    );
    res.status(200).json({ success: true, images: rows });
  } catch (error) {
    console.error("Get active hero images error:", error);
    res.status(500).json({ error: "Failed to fetch hero images" });
  }
};

// Upload a hero image
export const uploadHeroImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const filePath = `hero/${file.filename}`;
    const positionY =
      req.body.position_y !== undefined ? parseInt(req.body.position_y) : 50;
    const zoom = req.body.zoom !== undefined ? parseFloat(req.body.zoom) : 1.0;
    const clampedZoom = Math.max(1.0, Math.min(3.0, zoom));

    // Get the max display_order
    const [maxOrder] = await db.execute(
      "SELECT COALESCE(MAX(display_order), 0) as maxOrder FROM hero_images",
    );
    const newOrder = maxOrder[0].maxOrder + 1;

    const [result] = await db.execute(
      "INSERT INTO hero_images (image_path, display_order, position_y, zoom) VALUES (?, ?, ?, ?)",
      [filePath, newOrder, positionY, clampedZoom],
    );

    res.status(201).json({
      success: true,
      message: "Hero image uploaded successfully",
      image: {
        id: result.insertId,
        image_path: filePath,
        display_order: newOrder,
        is_active: 1,
        position_y: positionY,
        zoom: clampedZoom,
      },
    });
  } catch (error) {
    console.error("Upload hero image error:", error);
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {}
    }
    res.status(500).json({ error: "Failed to upload hero image" });
  }
};

// Delete a hero image
export const deleteHeroImage = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the image path first
    const [rows] = await db.execute(
      "SELECT image_path FROM hero_images WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    // Delete file from disk
    const fullPath = path.join(process.cwd(), "uploads", rows[0].image_path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete from DB
    await db.execute("DELETE FROM hero_images WHERE id = ?", [id]);

    res
      .status(200)
      .json({ success: true, message: "Hero image deleted successfully" });
  } catch (error) {
    console.error("Delete hero image error:", error);
    res.status(500).json({ error: "Failed to delete hero image" });
  }
};

// Toggle active status
export const toggleHeroImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const [result] = await db.execute(
      "UPDATE hero_images SET is_active = ? WHERE id = ?",
      [is_active ? 1 : 0, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Toggle hero image error:", error);
    res.status(500).json({ error: "Failed to update hero image status" });
  }
};

// Update display order
export const updateHeroImageOrder = async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of { id, display_order }

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    for (const item of orderedIds) {
      await db.execute(
        "UPDATE hero_images SET display_order = ? WHERE id = ?",
        [item.display_order, item.id],
      );
    }

    res.status(200).json({ success: true, message: "Order updated" });
  } catch (error) {
    console.error("Update hero image order error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// Update vertical position
export const updatePositionY = async (req, res) => {
  try {
    const { id } = req.params;
    const { position_y } = req.body;

    const posY = Math.max(0, Math.min(100, parseInt(position_y) || 50));

    const [result] = await db.execute(
      "UPDATE hero_images SET position_y = ? WHERE id = ?",
      [posY, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    res.status(200).json({ success: true, position_y: posY });
  } catch (error) {
    console.error("Update position error:", error);
    res.status(500).json({ error: "Failed to update position" });
  }
};

// Update zoom level
export const updateZoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { zoom } = req.body;

    const zoomVal = Math.max(1.0, Math.min(3.0, parseFloat(zoom) || 1.0));

    const [result] = await db.execute(
      "UPDATE hero_images SET zoom = ? WHERE id = ?",
      [zoomVal, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Hero image not found" });
    }

    res.status(200).json({ success: true, zoom: zoomVal });
  } catch (error) {
    console.error("Update zoom error:", error);
    res.status(500).json({ error: "Failed to update zoom" });
  }
};
