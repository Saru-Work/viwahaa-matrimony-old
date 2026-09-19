import db from "../utils/dbconfig.js";
import bcrypt from "bcryptjs";
import { sendPackageUpgradeSms, sendPaymentSettledSms } from "../utils/sms.js";

// Check if user has admin permissions
export const getAdminPermissions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is admin (user_type_id = 1)
    const [user] = await db.execute(
      "SELECT user_type_id FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const isAdmin = user[0].user_type_id === 1;

    res.status(200).json({ isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all profiles
export const getProfiles = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        c.id, c.member_id, c.first_name, c.last_name, c.email, 
        c.contact_no, c.whatsapp_no, c.d_o_b, c.age, c.gender, c.birth_place,
        c.address, c.birth_time, c.maritial_status, c.height, c.weight,
        c.complexion, c.physical_status, c.cast, c.religion, c.star_sign, c.rasi, c.sevvay_thoosam, c.sevvay_thoosam_position,
        c.family_value, c.family_type, c.family_status, c.fathers_name,
        c.fathers_occupation, c.mothers_name, c.mothers_occupation,
        c.brothers, c.sisters, c.mothers_native_place, c.fathers_native_place, c.married_brothers, c.married_sisters, c.more_family, c.country_of_birth, c.city_of_birth,
        c.country_of_resident, c.city_of_resident, c.country_of_citizenship,
        c.eating_habit, c.smoking_habit, c.drinking_habit, c.primary_school,
        c.secondary_school, c.education, c.occupation, c.annual_income,
        c.partner_country_of_resident, c.partner_resident_status,
        c.partner_education, c.partner_occupation, c.partner_annual_income,
        c.partner_marital_status, c.partner_minimum_age, c.partner_maximum_age,
        c.partner_minimum_height, c.partner_maximum_height, c.partner_physical_status,
        c.partner_mother_tongue, c.partner_religion, c.partner_star_sign,
        c.partner_cast, c.partner_eating_habit, c.partner_smoking_habit,
        c.partner_drinking_habit, c.status, c.profile_img, c.chart_img, c.img_1, c.img_2,
        c.created_at,
        bp.pay_type, bp.package AS current_plan, bp.exp_date,
        CASE WHEN bp.exp_date IS NOT NULL AND bp.exp_date < NOW() THEN 'Expired' ELSE 'Active' END AS package_status
      FROM customers c
      LEFT JOIN booked_packages bp ON bp.customer_id = c.id AND bp.id = (
        SELECT MAX(id) FROM booked_packages WHERE customer_id = c.id
      )
      ORDER BY c.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

// Search profiles
export const searchProfiles = async (req, res) => {
  try {
    const { search } = req.query;

    const [rows] = await db.execute(
      `SELECT 
        id, member_id, first_name, last_name, email, 
        contact_no, status, created_at 
       FROM customers 
       WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR contact_no LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to search profiles" });
  }
};

// Delete profile
export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if profile exists
    const [check] = await db.execute("SELECT id FROM customers WHERE id = ?", [
      id,
    ]);

    if (check.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // First delete related booked packages
    await db.execute("DELETE FROM booked_packages WHERE customer_id = ?", [id]);

    // Then delete the customer
    const [result] = await db.execute("DELETE FROM customers WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "Failed to delete profile" });
    }

    res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      error: "Failed to delete profile",
      details: error.message,
    });
  }
};

// Update profile status
export const updateProfileStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["single", "fixed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [result] = await db.execute(
      "UPDATE customers SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile status" });
  }
};

// Update profile details
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // First check if profile exists
    const [check] = await db.execute("SELECT id FROM customers WHERE id = ?", [
      id,
    ]);

    if (check.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Build the dynamic update query
    let updateQuery = "UPDATE customers SET ";
    const updateValues = [];
    const fieldsToUpdate = {};

    // Only include fields that are not null or undefined
    Object.keys(updateFields).forEach((key) => {
      if (updateFields[key] !== null && updateFields[key] !== undefined) {
        fieldsToUpdate[key] = updateFields[key];
      }
    });

    // Build the SET clause dynamically
    const setClauses = [];
    Object.keys(fieldsToUpdate).forEach((key) => {
      setClauses.push(`${key} = ?`);
      updateValues.push(fieldsToUpdate[key]);
    });

    // If no fields to update, return early
    if (setClauses.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    updateQuery += setClauses.join(", ");
    updateQuery += ", updated_at = NOW() WHERE id = ?";
    updateValues.push(id);

    const [result] = await db.execute(updateQuery, updateValues);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "Failed to update profile" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedFields: Object.keys(fieldsToUpdate),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Failed to update profile",
      details: error.message,
    });
  }
};

// Update profile images
export const updateProfileImages = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file; // Using multer single file upload

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Check if profile exists
    const [check] = await db.execute("SELECT id FROM customers WHERE id = ?", [
      id,
    ]);

    if (check.length === 0) {
      // Clean up the uploaded file if profile doesn't exist
      fs.unlinkSync(file.path);
      return res.status(404).json({ error: "Profile not found" });
    }

    // Determine the field to update based on query parameter or body
    const imageType = req.body.type || "profile_img";
    const validTypes = ["profile_img", "chart_img", "img_1", "img_2"];

    if (!validTypes.includes(imageType)) {
      fs.unlinkSync(file.path);
      return res.status(400).json({ error: "Invalid image type" });
    }

    // Construct the file path to store in database
    const filePath = `userimg/${file.filename}`;

    // Update the database
    const [result] = await db.execute(
      `UPDATE customers SET ${imageType} = ? WHERE id = ?`,
      [filePath, id]
    );

    if (result.affectedRows === 0) {
      fs.unlinkSync(file.path);
      return res.status(500).json({ error: "Failed to update profile images" });
    }

    // Get the updated profile to return the new image URL
    const [updatedProfile] = await db.execute(
      "SELECT * FROM customers WHERE id = ?",
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      imageUrl: filePath,
      profile: updatedProfile[0],
    });
  } catch (error) {
    console.error("Update profile images error:", error);
    // Clean up file if error occurred
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      error: "Failed to update profile images",
      details: error.message,
    });
  }
};

// Update user password
export const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.execute(
      "UPDATE customers SET password = ?, plain_text_password = ? WHERE id = ?",
      [hashedPassword, newPassword, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      error: "Failed to update password",
      details: error.message,
    });
  }
};

// Get profile details
export const getProfileDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      `SELECT 
        c.id, c.member_id, c.first_name, c.last_name, c.email, c.contact_no, c.whatsapp_no, c.password,
        c.d_o_b, c.age, c.gender, c.birth_place, c.address, c.birth_time, c.maritial_status, c.height,
        c.weight, c.complexion, c.physical_status, c.cast, c.religion, c.star_sign, c.rasi, c.sevvay_thoosam, c.sevvay_thoosam_position,
        c.family_value, c.family_type, c.family_status, c.fathers_name, c.fathers_occupation,
        c.mothers_name, c.mothers_occupation, c.brothers, c.sisters, c.mothers_native_place, c.fathers_native_place, c.married_brothers, c.married_sisters, c.more_family,
        c.country_of_birth, c.city_of_birth, c.country_of_resident, c.city_of_resident,
        c.country_of_citizenship, c.eating_habit, c.smoking_habit, c.drinking_habit,
        c.primary_school, c.secondary_school, c.education, c.occupation, c.occupation_details, c.annual_income,
        c.profile_img, c.img_1, c.img_2, c.chart_img,
        c.partner_country_of_resident, c.partner_resident_status, c.partner_education,
        c.partner_occupation, c.partner_annual_income, c.partner_marital_status,
        c.partner_minimum_age, c.partner_maximum_age, c.partner_minimum_height,
        c.partner_maximum_height, c.partner_physical_status, c.partner_mother_tongue,
        c.partner_religion, c.partner_star_sign, c.partner_cast, c.partner_eating_habit,
        c.partner_smoking_habit, c.partner_drinking_habit,
        c.status, c.created_at,
        bp.pay_type, bp.package AS current_plan, bp.exp_date,
        CASE WHEN bp.exp_date IS NOT NULL AND bp.exp_date < NOW() THEN 'Expired' ELSE 'Active' END AS package_status
       FROM customers c
       LEFT JOIN booked_packages bp ON bp.customer_id = c.id AND bp.id = (
         SELECT MAX(id) FROM booked_packages WHERE customer_id = c.id
       )
       WHERE c.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile details" });
  }
};

export const getBookingsCount = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM booked_packages"
    );
    res.status(200).json({ count: rows[0].count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings count" });
  }
};

// Get default partner preferences for non-registered users
export const getDefaultPreferences = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      "SELECT setting_value FROM site_settings WHERE setting_key = 'default_partner_preferences'"
    );

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        preferences: {
          min_age: 18,
          max_age: 50,
          religion: 'Any',
          cast: 'Any',
          gender: 'female'
        }
      });
    }

    const preferences = JSON.parse(rows[0].setting_value);
    res.status(200).json({ success: true, preferences });
  } catch (error) {
    console.error("Error fetching default preferences:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Update default partner preferences for non-registered users
export const updateDefaultPreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({ success: false, error: "Missing preferences in request body" });
    }

    const [rows] = await db.execute(
      "SELECT id FROM site_settings WHERE setting_key = 'default_partner_preferences'"
    );

    if (rows.length > 0) {
      await db.execute(
        "UPDATE site_settings SET setting_value = ? WHERE setting_key = 'default_partner_preferences'",
        [JSON.stringify(preferences)]
      );
    } else {
      await db.execute(
        "INSERT INTO site_settings (setting_key, setting_value) VALUES ('default_partner_preferences', ?)",
        [JSON.stringify(preferences)]
      );
    }

    res.status(200).json({ success: true, message: "Default preferences updated successfully" });
  } catch (error) {
    console.error("Error updating default preferences:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get interests count
export const getInterestsCount = async (req, res) => {
  try {
    // Corrected table name to 'intresteds'
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM intresteds");

    res.status(200).json({
      success: true,
      count: rows[0].count,
    });
  } catch (error) {
    console.error("Error fetching interests count:", error);
    res.status(500).json({
      error: "Failed to fetch interests count",
      details: error.message,
    });
  }
};

// Get total earnings
export const getTotalEarnings = async (req, res) => {
  try {
    // Calculate total earnings by summing all income values
    const [result] = await db.execute(
      "SELECT SUM(CAST(income AS DECIMAL(10,2))) AS total FROM booked_packages"
    );

    // If no records found, return 0
    const totalEarnings = result[0].total || 0;

    res.status(200).json({
      success: true,
      amount: totalEarnings,
    });
  } catch (error) {
    console.error("Error fetching total earnings:", error);
    res.status(500).json({
      error: "Failed to fetch total earnings",
      details: error.message,
    });
  }
};

{
  /*---------------------------Intrest-----------------------------*/
}

export const getInterests = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM intresteds ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch interests" });
  }
};

export const searchInterests = async (req, res) => {
  try {
    const { search } = req.query;
    const [rows] = await db.execute(
      "SELECT * FROM intresteds WHERE name LIKE ? OR email LIKE ?",
      [`%${search}%`, `%${search}%`]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to search interests" });
  }
};

export const deleteInterest = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute("DELETE FROM intresteds WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Interest not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete interest" });
  }
};

{
  /* ---------------------Profile Interest----------------*/
}

// Get all profile interests
export const getProfileInterests = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT * FROM profile_intresteds 
      ORDER BY created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile interests" });
  }
};

// Search profile interests
export const searchProfileInterests = async (req, res) => {
  try {
    const { search } = req.query;

    const [rows] = await db.execute(
      `SELECT * FROM profile_intresteds 
       WHERE customer_name LIKE ? OR mem_id LIKE ? OR profile_name LIKE ? OR profile_mem_id LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to search profile interests" });
  }
};

// Delete profile interest
export const deleteProfileInterest = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if record exists
    const [check] = await db.execute(
      "SELECT id FROM profile_intresteds WHERE id = ?",
      [id]
    );

    if (check.length === 0) {
      return res.status(404).json({ error: "Profile interest not found" });
    }

    const [result] = await db.execute(
      "DELETE FROM profile_intresteds WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ error: "Failed to delete profile interest" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete profile interest error:", error);
    res.status(500).json({
      error: "Failed to delete profile interest",
      details: error.message,
    });
  }
};

{
  /*----------Package Booking----------------------*/
}

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT bp.*, 
             c.first_name, 
             c.last_name, 
             c.contact_no, 
             c.whatsapp_no,
             c.package_plan
      FROM booked_packages bp
      JOIN customers c ON bp.customer_id = c.id
      ORDER BY bp.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Search bookings
export const searchBookings = async (req, res) => {
  try {
    const { search } = req.query;
    const [rows] = await db.execute(
      `SELECT bp.*, c.first_name, c.last_name, c.contact_no, c.whatsapp_no 
       FROM booked_packages bp
       JOIN customers c ON bp.customer_id = c.id
       WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.contact_no LIKE ? OR c.whatsapp_no LIKE ? OR bp.package LIKE ?`,
      [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to search bookings" });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.execute(
      "DELETE FROM booked_packages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullPayment } = req.body;

    // Get current booking and customer details for SMS.
    const [booking] = await db.execute(
      `SELECT bp.*, c.first_name, c.contact_no
       FROM booked_packages bp
       JOIN customers c ON c.id = bp.customer_id
       WHERE bp.id = ?`,
      [id]
    );
    if (booking.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (fullPayment) {
      // Update balance to 0 and add to install_amount
      const settledBalance = parseFloat(booking[0].balance || 0);
      const newInstallAmount =
        parseFloat(booking[0].install_amount) + parseFloat(booking[0].balance);
      await db.execute(
        "UPDATE booked_packages SET balance = '0', install_amount = ? WHERE id = ?",
        [newInstallAmount.toString(), id]
      );

      if (settledBalance > 0) {
        const smsResult = await sendPaymentSettledSms({
          phone: booking[0].contact_no,
          firstName: booking[0].first_name,
          packageName: booking[0].package,
          settledAmount: settledBalance,
          paidDate: new Date(),
        });

        if (!smsResult.success) {
          console.error("Payment settled SMS not sent:", smsResult);
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to process payment" });
  }
};

// Update package status
export const updatePackageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "Basic Plan",
      "Standard Plan",
      "Premium Plan",
      "Ultimate Plan",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Get booking and customer details to send confirmation SMS.
    const [booking] = await db.execute(
      `SELECT bp.customer_id, bp.exp_date, bp.pay_type, bp.balance, bp.created_at,
              c.first_name, c.contact_no
       FROM booked_packages bp
       JOIN customers c ON c.id = bp.customer_id
       WHERE bp.id = ?`,
      [id]
    );

    if (!booking.length) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const customerId = booking[0].customer_id;

    // Update the booked package
    await db.execute("UPDATE booked_packages SET package = ? WHERE id = ?", [
      status,
      id,
    ]);

    // Update the customer's current package plan
    await db.execute("UPDATE customers SET package_plan = ? WHERE id = ?", [
      status,
      customerId,
    ]);

    const bookingRow = booking[0];
    const smsResult = await sendPackageUpgradeSms({
      phone: bookingRow.contact_no,
      firstName: bookingRow.first_name,
      packageName: status,
      expiryDate: bookingRow.exp_date,
      payType: bookingRow.pay_type,
      remainingBalance: bookingRow.balance,
      nextInstallmentDate: bookingRow.created_at,
    });

    if (!smsResult.success) {
      console.error("Package confirmation SMS not sent:", smsResult);
    }

    res.status(200).json({ success: true, smsSent: Boolean(smsResult.success) });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update package status" });
  }
};

// Update expiry date
export const updateExpiryDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { exp_date } = req.body;

    const [result] = await db.execute(
      "UPDATE booked_packages SET exp_date = ? WHERE id = ?",
      [exp_date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update expiry date" });
  }
};

export const changeAdminCredentials = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, newEmail } = req.body;

    if (!userId || !currentPassword) {
      return res.status(400).json({ success: false, message: "User ID and current password are required." });
    }

    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin user not found." });
    }

    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    if (!newPassword && !newEmail) {
      return res.status(400).json({ success: false, message: "Provide a new password or new email to update." });
    }

    if (newEmail && newEmail !== admin.email) {
      const [existing] = await db.execute("SELECT id FROM users WHERE email = ? AND id != ?", [newEmail, userId]);
      if (existing.length > 0) {
        return res.status(409).json({ success: false, message: "This email is already in use." });
      }
      await db.execute("UPDATE users SET email = ? WHERE id = ?", [newEmail, userId]);
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
      }
      const hashed = await bcrypt.hash(newPassword, 10);
      await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);
    }

    res.status(200).json({ success: true, message: "Credentials updated successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
