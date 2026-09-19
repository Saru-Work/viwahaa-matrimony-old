import db from "./dbconfig.js";

const initDb = async () => {
  try {
    // 1. Add notification_type column if it doesn't exist
    const [columns] = await db.query("SHOW COLUMNS FROM interested_profiles LIKE 'notification_type'");
    if (columns.length === 0) {
      await db.query("ALTER TABLE interested_profiles ADD COLUMN notification_type VARCHAR(50) DEFAULT 'interest'");
      console.log("Added notification_type column to interested_profiles table.");
    }

    // 2. Update unique constraint to include notification_type
    const [indexes] = await db.query("SHOW INDEX FROM interested_profiles WHERE Key_name = 'unique_interest'");
    if (indexes.length > 0) {
      await db.query("ALTER TABLE interested_profiles DROP INDEX unique_interest");
      await db.query("ALTER TABLE interested_profiles ADD UNIQUE KEY unique_notification (user_id, profile_id, notification_type)");
      console.log("Updated unique constraint on interested_profiles table.");
    }

    console.log("Database schema check completed.");
  } catch (err) {
    console.error("Error during database initialization:", err);
  }
};

export default initDb;
