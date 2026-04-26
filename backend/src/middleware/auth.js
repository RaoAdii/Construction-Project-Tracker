import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);

    if (decoded.isHardcodedAdmin && decoded.role === "admin") {
      req.user = {
        id: "hardcoded-admin",
        _id: "hardcoded-admin",
        username: "admin",
        email: "admin@construction.local",
        fullName: "System Administrator",
        jobTitle: "Platform Admin",
        bio: "",
        avatarUrl: "",
        role: "admin",
      };
      next();
      return;
    }

    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
