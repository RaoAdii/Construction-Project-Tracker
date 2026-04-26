import { validationResult } from "express-validator";
import Project from "../models/Project.js";
import Consultant from "../models/Consultant.js";
import User from "../models/User.js";

function isAdmin(user) {
  return user?.role === "admin";
}

function projectScope(user) {
  return isAdmin(user) ? {} : { createdBy: user._id };
}

async function findAccessibleProject(projectId, user, populate = null) {
  let query = Project.findOne({
    _id: projectId,
    ...projectScope(user),
  });

  if (populate) {
    for (const rule of populate) {
      query = query.populate(rule);
    }
  }

  return query;
}

export async function addMaterialUsage(req, res, next) {
  try {
    const { id } = req.params;
    const {
      date,
      cementUsed,
      bricksUsed,
      steelBarsUsed,
      otherUsed,
      labourCharge,
      note,
    } = req.body;

    const project = await findAccessibleProject(id, req.user);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.materials.usageLog.push({
      date: date ? new Date(date) : new Date(),
      cementUsed: cementUsed || 0,
      bricksUsed: bricksUsed || 0,
      steelBarsUsed: steelBarsUsed || 0,
      otherUsed: otherUsed || 0,
      labourCharge: labourCharge || 0,
      note: note || "",
    });

    project.materials.cement -= cementUsed || 0;
    project.materials.bricks -= bricksUsed || 0;
    project.materials.steelBars -= steelBarsUsed || 0;
    project.materials.other -= otherUsed || 0;

    await project.save();
    res.json({ materials: project.materials });
  } catch (error) {
    next(error);
  }
}

export async function getMaterialUsage(req, res, next) {
  try {
    const project = await findAccessibleProject(req.params.id, req.user);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ materials: project.materials });
  } catch (error) {
    next(error);
  }
}

export async function listProjects(req, res, next) {
  try {
    const projects = await Project.find(projectScope(req.user))
      .populate("consultant", "fullName shortName")
      .populate("createdBy", "fullName username")
      .sort({ updatedAt: -1 });

    res.json({ projects });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await findAccessibleProject(req.params.id, req.user, [
      { path: "consultant", select: "fullName shortName description" },
      { path: "createdBy", select: "fullName username jobTitle" },
      { path: "followers", select: "fullName username" },
    ]);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        details: errors.array(),
      });
    }

    const consultant = await Consultant.findById(req.body.consultant);

    if (!consultant) {
      return res.status(400).json({ message: "Consultant does not exist." });
    }

    const project = await Project.create({
      ...req.body,
      createdBy: req.user._id,
      followers: [req.user._id],
    });

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { followedProjects: project._id },
    });

    const hydratedProject = await Project.findById(project._id)
      .populate("consultant", "fullName shortName")
      .populate("createdBy", "fullName username");

    res.status(201).json({ project: hydratedProject });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        details: errors.array(),
      });
    }

    if (req.body.consultant) {
      const consultant = await Consultant.findById(req.body.consultant);

      if (!consultant) {
        return res.status(400).json({ message: "Consultant does not exist." });
      }
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        ...projectScope(req.user),
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("consultant", "fullName shortName")
      .populate("createdBy", "fullName username");

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
}

export async function toggleFollowProject(req, res, next) {
  try {
    const project = await findAccessibleProject(req.params.id, req.user);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const userId = req.user._id;
    const isFollowing = project.followers.some(
      (followerId) => String(followerId) === String(userId)
    );

    if (isFollowing) {
      project.followers = project.followers.filter(
        (followerId) => String(followerId) !== String(userId)
      );

      await User.findByIdAndUpdate(userId, {
        $pull: { followedProjects: project._id },
      });
    } else {
      project.followers.push(userId);

      await User.findByIdAndUpdate(userId, {
        $addToSet: { followedProjects: project._id },
      });
    }

    await project.save();

    res.json({
      following: !isFollowing,
      followerCount: project.followers.length,
    });
  } catch (error) {
    next(error);
  }
}
