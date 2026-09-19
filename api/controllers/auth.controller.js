import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import db from "../utils/dbconfig.js";
import { sendRegistrationSms } from "../utils/sms.js";

export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, dateOfBirth, gender, phone, religion, cast, occupation, country_of_resident } =
    req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !password || !dateOfBirth || !gender || !phone || !religion || !cast || !occupation || !country_of_resident) {
    return next(errorHandler(400, "All fields are required"));
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  // Date validation
  const isValidDate = !isNaN(Date.parse(dateOfBirth));
  if (!isValidDate) {
    return next(errorHandler(400, "Invalid date format for date of birth."));
  }

  try {
    // 1. First check if email already exists
    const [emailCheck] = await db.execute(
      "SELECT email FROM customers WHERE email = ?",
      [email]
    );

    if (emailCheck.length > 0) {
      return next(errorHandler(400, "Email already exists. Please use a different email."));
    }

    // 2. Get the highest existing member ID
    const [rows] = await db.execute(
      "SELECT member_id FROM customers ORDER BY member_id DESC LIMIT 1"
    );

    let nextMemberId = "VM002193"; // Default starting point if no users exist

    if (rows.length > 0) {
      const lastMemberId = rows[0].member_id;
      // Extract the numeric part and increment
      const numericPart = parseInt(lastMemberId.replace("VM", ""));
      nextMemberId = `VM${String(numericPart + 1).padStart(6, '0')}`;
    }

    // Calculate exact age based on month/day to avoid off-by-one validation errors.
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthday =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if (!hasHadBirthday) {
      age -= 1;
    }
    
    // Validate age (example: must be at least 18 years old)
    if (age < 18) {
      return next(errorHandler(400, "You must be at least 18 years old to register"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const currentTimestamp = new Date();

    // 3. Insert the new user
    const [result] = await db.execute(
      `INSERT INTO customers 
       (member_id, first_name, last_name, email, password, d_o_b, age, gender, contact_no, religion, cast, occupation, country_of_resident, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nextMemberId,
        firstName,
        lastName,
        email,
        hashedPassword,
        dateOfBirth,
        age,
        gender,
        phone,
        religion,
        cast,
        occupation,
        country_of_resident,
        currentTimestamp
      ]
    );

    const userId = result.insertId;

    // 4. Assign default profile image if exists (Sharan-Dev changes)
    try {
      const [religionRow] = await db.execute("SELECT id FROM religions WHERE name = ?", [religion]);
      if (religionRow.length > 0) {
        const religionId = religionRow[0].id;
        const [defaultImg] = await db.execute(
          "SELECT image_path FROM default_profile_images WHERE religion_id = ? AND gender = ?",
          [religionId, gender]
        );
        if (defaultImg.length > 0) {
          await db.execute(
            "UPDATE customers SET profile_img = ? WHERE id = ?",
            [defaultImg[0].image_path, userId]
          );
        }
      }
    } catch (err) {
      console.error("Error assigning default profile image:", err);
      // Don't fail registration if default image assignment fails
    }

    // 5. Send SMS notification (Main changes)
    // SMS delivery should not block account creation.
    const smsResult = await sendRegistrationSms({
      phone,
      firstName,
      memberId: nextMemberId,
    });

    if (!smsResult.success) {
      console.error("QuickSend SMS not sent:", smsResult);
    }

    res.status(201).json({ 
      success: true,
      message: "User registered successfully!",
      memberId: nextMemberId,
      smsSent: Boolean(smsResult.success),
    });

    // 6. Notify users with matching preferences (Post-response processing)
    try {
      const targetGender = gender === "male" ? "female" : "male";
      
      const [matchingUsers] = await db.execute(
        `SELECT id, first_name FROM customers 
         WHERE id != ? 
           AND gender = ? 
           AND (partner_religion = ? OR partner_religion = 'Any' OR partner_religion IS NULL OR partner_religion = '')
           AND (partner_cast = ? OR partner_cast = 'Any' OR partner_cast IS NULL OR partner_cast = '')
           AND (partner_country_of_resident = ? OR partner_country_of_resident = 'Any' OR partner_country_of_resident IS NULL OR partner_country_of_resident = '')`,
        [userId, targetGender, religion, cast, country_of_resident]
      );

      for (const mUser of matchingUsers) {
        try {
          // Insert into interested_profiles with 'preference_match' type
          await db.execute(
            "INSERT INTO interested_profiles (user_id, profile_id, notification_type) VALUES (?, ?, ?)",
            [userId, mUser.id, 'preference_match']
          );

          // Emit real-time notification if user is online
          const recipientSocketId = req.onlineUsers?.get(String(mUser.id));
          if (recipientSocketId && req.io) {
            req.io.to(recipientSocketId).emit("notification_received", {
              senderName: firstName,
              senderMemberId: nextMemberId,
              type: "preference_match",
              message: `A user matching your preferences, ${firstName} (${nextMemberId}), has just registered!`
            });
          }
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.error(`Error notifying user ${mUser.id}:`, err);
          }
        }
      }
    } catch (notifyErr) {
      console.error("Error in match notification process:", notifyErr);
    }
    
  } catch (error) {
    console.error("Registration Error:", error);
    
    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return next(errorHandler(400, "Email already exists. Please use a different email."));
    }
    
    // Handle other potential errors
    next(errorHandler(500, "Registration failed. Please try again later."));
  }
};

export const signin = async (req, res, next) => {
  const { email, password, isAdmin } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Determine which table to query based on isAdmin flag
    // For staff signin, we also need to check the users table
    const table = isAdmin ? 'users' : 'customers';
    
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const user = rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // For admin/staff signin, verify user type
    if (isAdmin) {
      // Allow both admin (user_type_id = 1) and staff (user_type_id = 2)
      // Adjust these IDs based on your actual user type system
      if (user.user_type_id !== 1 && user.user_type_id !== 3) {
        return res.status(403).json({ message: "Admin/Staff access denied! Invalid user type." });
      }
    }

    // Create token with appropriate payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      isAdmin: isAdmin ? true : false,
      userType: user.user_type_id // Include user type for frontend differentiation
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1h" });

    const { password: _, ...otherDetails } = user;

    // Set expiry date to 1 hour from current time
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    res
      .cookie("access_token", token, { 
        httpOnly: true, 
        expires: expiryDate,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .status(200)
      .json({ 
        user: otherDetails, 
        token,
        isAdmin: isAdmin ? true : false,
        userType: user.user_type_id
      });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};