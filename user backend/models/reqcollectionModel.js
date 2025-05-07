const mongoose = require("mongoose");

const reqSchema = mongoose.Schema(
  {
    reqId: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
    dropdown: {
      type: String,
      enum: ["dry", "wet", "mixed"],
      default: undefined,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "collected", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("req", reqSchema);
