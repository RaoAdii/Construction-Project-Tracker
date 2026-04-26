import { Router } from "express";
import authRoutes from "./authRoutes.js";
import consultantRoutes from "./consultantRoutes.js";
import projectRoutes from "./projectRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/consultants", consultantRoutes);
router.use("/projects", projectRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
