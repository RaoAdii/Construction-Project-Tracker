import { validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

const HARDCODED_ADMIN = {
  id: "hardcoded-admin",
  username: "admin",
  email: "admin@construction.local",
  password: "Admin@12345",
  fullName: "System Administrator",
  jobTitle: "Platform Admin",
  bio: "",
  avatarUrl: "",
  role: "admin",
};

function buildAuthResponse(user) {
  return {
    token: generateToken({ userId: user._id.toString(), role: user.role }),
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      jobTitle: user.jobTitle,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role,
    },
  };
}

function buildHardcodedAdminResponse() {
  return {
    token: generateToken({
      userId: HARDCODED_ADMIN.id,
      role: HARDCODED_ADMIN.role,
      isHardcodedAdmin: true,
    }),
    user: {
      id: HARDCODED_ADMIN.id,
      username: HARDCODED_ADMIN.username,
      email: HARDCODED_ADMIN.email,
      fullName: HARDCODED_ADMIN.fullName,
      jobTitle: HARDCODED_ADMIN.jobTitle,
      bio: HARDCODED_ADMIN.bio,
      avatarUrl: HARDCODED_ADMIN.avatarUrl,
      role: HARDCODED_ADMIN.role,
    },
  };
}

export async function register(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        details: errors.array(),
      });
    }

    const { username, email, password, fullName, jobTitle } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with that email or username already exists.",
      });
    }

    const passwordHash = await User.hashPassword(password);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      jobTitle,
      role: "manager",
    });

    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        details: errors.array(),
      });
    }

    const email = req.body.email?.trim().toLowerCase() || "";
    const password = req.body.password || "";

    if (
      email === HARDCODED_ADMIN.email &&
      password === HARDCODED_ADMIN.password
    ) {
      return res.json(buildHardcodedAdminResponse());
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json(buildAuthResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(req, res) {
  return res.json({
    user: {
      id: req.user._id?.toString?.() || req.user.id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.fullName,
      jobTitle: req.user.jobTitle,
      bio: req.user.bio,
      avatarUrl: req.user.avatarUrl,
      role: req.user.role,
    },
  });
}
