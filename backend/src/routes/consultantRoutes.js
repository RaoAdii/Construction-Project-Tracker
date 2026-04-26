import { Router } from "express";
import { body } from "express-validator";
import {
  createConsultant,
  listConsultants,
} from "../controllers/consultantController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, listConsultants);
router.post(
  "/",
  requireAuth,
  [
    body("fullName").trim().notEmpty(),
    body("shortName").trim().notEmpty(),
    body("description").optional().isString(),
  ],
  createConsultant
);

export default router;
