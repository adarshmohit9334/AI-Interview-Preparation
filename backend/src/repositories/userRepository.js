import bcrypt from "bcryptjs";
import pool from "../config/db.js";

// In-memory fallback repository when local MySQL is unconfigured
const memoryUsers = new Map();
let memoryUserIdCounter = 1;

export class UserRepository {
  async findByEmail(email) {
    if (pool) {
      try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email.toLowerCase().trim()]);
        if (rows.length > 0) return rows[0];
      } catch (err) {
        // Fallback to memory if database table or connection is not ready
      }
    }
    return memoryUsers.get(email.toLowerCase().trim()) || null;
  }

  async findById(id) {
    if (pool) {
      try {
        const [rows] = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1", [id]);
        if (rows.length > 0) return rows[0];
      } catch (err) {
        // Fallback to memory
      }
    }
    for (const user of memoryUsers.values()) {
      if (user.id === Number(id)) {
        const { password_hash, ...sanitized } = user;
        return sanitized;
      }
    }
    return null;
  }

  async create({ name, email, password }) {
    const password_hash = await bcrypt.hash(password, 10);
    const cleanEmail = email.toLowerCase().trim();

    if (pool) {
      try {
        const [result] = await pool.query(
          "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
          [name.trim(), cleanEmail, password_hash]
        );
        return {
          id: result.insertId,
          name: name.trim(),
          email: cleanEmail,
          role: "candidate",
          created_at: new Date()
        };
      } catch (err) {
        // If DB table does not exist or connection fails, fallback to memory
      }
    }

    const newUser = {
      id: memoryUserIdCounter++,
      name: name.trim(),
      email: cleanEmail,
      password_hash,
      role: "candidate",
      created_at: new Date()
    };
    memoryUsers.set(cleanEmail, newUser);
    const { password_hash: _, ...sanitized } = newUser;
    return sanitized;
  }

  async verifyPassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
  }
}

export const userRepository = new UserRepository();
