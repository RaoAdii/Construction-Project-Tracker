import mongoose from "mongoose";

const consultantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

consultantSchema.index({ fullName: 1 }, { unique: true });
consultantSchema.index({ shortName: 1 }, { unique: true });

const Consultant = mongoose.model("Consultant", consultantSchema);

export default Consultant;
