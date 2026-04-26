import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    week: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    activities: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      default: "",
    },
    slippageReason: {
      type: String,
      default: "",
    },
    remark: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ project: 1, week: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
