import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
  const { name, email, password, phone, currency, timezone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const existing = await pool.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `
      INSERT INTO users (name, email, password_hash, phone, currency, timezone)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, name, email, phone, currency, timezone
      `,
      [name, email, hashedPassword, phone || null, currency || "INR", timezone || null]
    );

    const user = insertResult.rows[0];
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ message: "Registered", token, user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        currency: user.currency,
        timezone: user.timezone,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Login failed" });
  }
};
