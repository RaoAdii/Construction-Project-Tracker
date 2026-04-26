import { validationResult } from "express-validator";
import Consultant from "../models/Consultant.js";

export async function listConsultants(req, res, next) {
  try {
    const consultants = await Consultant.find().sort({ shortName: 1 });
    const seen = new Set();
    const dedupedConsultants = consultants.filter((consultant) => {
      const key = `${consultant.shortName}`.trim().toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
    res.json({ consultants: dedupedConsultants });
  } catch (error) {
    next(error);
  }
}

export async function createConsultant(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed.",
        details: errors.array(),
      });
    }

    const fullName = req.body.fullName.trim();
    const shortName = req.body.shortName.trim();
    const description = (req.body.description || "").trim();

    const existingConsultant = await Consultant.findOne({
      $or: [
        { fullName: { $regex: `^${fullName}$`, $options: "i" } },
        { shortName: { $regex: `^${shortName}$`, $options: "i" } },
      ],
    });

    if (existingConsultant) {
      return res.status(409).json({
        message: "A consultant with that short name or full name already exists.",
      });
    }

    const consultant = await Consultant.create({
      fullName,
      shortName,
      description,
    });
    res.status(201).json({ consultant });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A consultant with that short name or full name already exists.",
      });
    }
    next(error);
  }
}
