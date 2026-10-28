import express from "express";
import { userRepository } from "../repositories/userRepository.js";
import { generateToken, authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Register new candidate
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters." });
    }

    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: "An account with this email already exists." });
    }

    const user = await userRepository.create({ name, email, password });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user,
      token
    });
  } catch (err) {
    next(err);
  }
});

// Login candidate
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required." });
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const isMatch = await userRepository.verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password." });
    }

    const { password_hash, ...sanitizedUser } = user;
    const token = generateToken(sanitizedUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      user: sanitizedUser,
      token
    });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully." });
});

// Current authenticated user profile
router.get("/me", authenticateToken, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
