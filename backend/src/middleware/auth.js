import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/userRepository.js";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_dev_jwt_key_interviewiq_change_in_production";

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

export async function authenticateToken(req, res, next) {
  try {
    let token = null;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, error: "Access denied. Authentication token required." });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, error: "User belonging to this token no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid or expired authentication token." });
  }
}
