import { Router } from "express";
import { body } from "express-validator";
import {
  createProject,
  getProject,
  listProjects,
  toggleFollowProject,
  updateProject,
  addMaterialUsage,
  getMaterialUsage,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";

const projectValidation = [
  body("constructionType").isIn(["building", "road", "water"]),
  body("status").isIn([
    "unknown",
    "mobilization",
    "active",
    "rectification",
    "suspended",
    "terminated",
    "closed",
  ]),
  body("consultant").notEmpty(),
  body("employer").trim().notEmpty(),
  body("fullName").trim().notEmpty(),
  body("shortName").trim().notEmpty(),
  body("description").optional().isString(),
  body("contractAmount").isFloat({ min: 0 }),
  body("signingDate").optional({ nullable: true }).isISO8601(),
  body("siteHandover").optional({ nullable: true }).isISO8601(),
  body("commencementDate").isISO8601(),
  body("period").isInt({ min: 1 }),
  // Material tracking fields
  body("materials.cement").optional().isInt({ min: 0 }),
  body("materials.bricks").optional().isInt({ min: 0 }),
  body("materials.steelBars").optional().isInt({ min: 0 }),
  body("materials.other").optional().isInt({ min: 0 }),
  body("materials.usageLog").optional().isArray(),
];

const router = Router();

router.use(requireAuth);
router.get("/", listProjects);
router.get("/:id", getProject);
router.post("/", projectValidation, createProject);
router.put("/:id", projectValidation, updateProject);

// Material usage endpoints
router.get("/:id/materials", getMaterialUsage);
router.post("/:id/materials", addMaterialUsage);

router.post("/:id/follow", toggleFollowProject);

export default router;
