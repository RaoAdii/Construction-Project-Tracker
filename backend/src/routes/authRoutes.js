import { Router } from "express";
import { body } from "express-validator";
import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("username").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    body("fullName").trim().notEmpty(),
    body("jobTitle").trim().notEmpty(),
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  login
);

router.get("/me", requireAuth, getCurrentUser);

export default router;
