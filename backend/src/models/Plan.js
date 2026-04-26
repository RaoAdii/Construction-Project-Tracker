import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
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
  },
  {
    timestamps: true,
  }
);

planSchema.index({ schedule: 1, week: 1 }, { unique: true });

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
