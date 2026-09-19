import db from "./dbconfig.js";

const createSettingsTable = async () => {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'site_settings'");
    if (tables.length === 0) {
      await db.query(`
        CREATE TABLE site_settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          setting_key VARCHAR(255) UNIQUE NOT NULL,
          setting_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log("Created site_settings table.");
      
      // Insert default partner preferences
      const defaultPrefs = {
        min_age: 18,
        max_age: 50,
        religion: 'Hindu',
        cast: 'Any',
        gender: 'male' 
      };
      
      await db.query(
        "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)",
        ['default_partner_preferences', JSON.stringify(defaultPrefs)]
      );
      console.log("Inserted default partner preferences.");
    } else {
      console.log("site_settings table already exists.");
    }
  } catch (err) {
    console.error("Error creating site_settings table:", err);
  }
};

createSettingsTable().then(() => process.exit());
