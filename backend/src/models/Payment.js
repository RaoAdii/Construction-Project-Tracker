import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    previousPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    paymentType: {
      type: String,
      enum: ["advance", "interim", "final"],
      default: "interim",
    },
    status: {
      type: String,
      enum: ["submitted", "under_correction", "approved", "rejected"],
      default: "submitted",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    serviceSum: {
      type: Number,
      default: 0,
      min: 0,
    },
    materialOnsite: {
      type: Number,
      default: 0,
      min: 0,
    },
    advanceRepaymentPercent: {
      type: Number,
      default: 30,
      min: 0,
    },
    retentionRepaymentPercent: {
      type: Number,
      default: 5,
      min: 0,
    },
    penaltyRepaymentPercent: {
      type: Number,
      default: 0,
      min: 0,
    },
    preparedBy: {
      type: String,
      default: "",
    },
    submittedReferenceNo: {
      type: String,
      default: "",
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    decidedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
