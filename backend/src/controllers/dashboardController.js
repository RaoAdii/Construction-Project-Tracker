import Project from "../models/Project.js";
import Consultant from "../models/Consultant.js";

export async function getDashboardSummary(req, res, next) {
  try {
    const projectFilter =
      req.user?.role === "admin" ? {} : { createdBy: req.user._id };

    const [projectCount, consultantCount, activeProjects] = await Promise.all([
      Project.countDocuments(projectFilter),
      Consultant.countDocuments(),
      Project.countDocuments({ ...projectFilter, status: "active" }),
    ]);

    const recentProjects = await Project.find(projectFilter)
      .populate("consultant", "shortName")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      summary: {
        projectCount,
        consultantCount,
        activeProjects,
      },
      recentProjects,
    });
  } catch (error) {
    next(error);
  }
}
