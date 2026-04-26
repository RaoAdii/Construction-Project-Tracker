import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    constructionType: {
      type: String,
      enum: ["building", "road", "water"],
      default: "building",
    },
    status: {
      type: String,
      enum: [
        "unknown",
        "mobilization",
        "active",
        "rectification",
        "suspended",
        "terminated",
        "closed",
      ],
      default: "unknown",
    },
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      required: true,
    },
    employer: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    shortName: {
      type: String,
      required: true,
      trim: true,
    },
    projectCode: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    contractAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    signingDate: {
      type: Date,
      default: null,
    },
    siteHandover: {
      type: Date,
      default: null,
    },
    commencementDate: {
      type: Date,
      required: true,
    },
    period: {
      type: Number,
      required: true,
      min: 1,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Material tracking
    materials: {
      cement: {
        type: Number,
        default: 0,
        min: 0,
      },
      bricks: {
        type: Number,
        default: 0,
        min: 0,
      },
      steelBars: {
        type: Number,
        default: 0,
        min: 0,
      },
      other: {
        type: Number,
        default: 0,
        min: 0,
      },
      usageLog: [
        {
          date: { type: Date, required: true },
          cementUsed: { type: Number, default: 0 },
          bricksUsed: { type: Number, default: 0 },
          steelBarsUsed: { type: Number, default: 0 },
          otherUsed: { type: Number, default: 0 },
          labourCharge: { type: Number, default: 0 },
          note: { type: String, default: "" },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

projectSchema.virtual("completionDate").get(function completionDate() {
  const start = this.commencementDate ? new Date(this.commencementDate) : null;

  if (!start || !this.period) {
    return null;
  }

  const result = new Date(start);
  result.setDate(result.getDate() + this.period);
  return result;
});

projectSchema.virtual("daysLeft").get(function daysLeft() {
  if (!this.completionDate) {
    return null;
  }

  const today = new Date();
  const diff = this.completionDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
