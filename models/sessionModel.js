const mongoose = require("mongoose");

// Session Schema

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id cannot be empty"],
    },
    refreshToken: {
      type: String,
      required: [true, "Token cannot be empty"],
    },
  },
  { timestamps: true }
);

// Export Model

module.exports = mongoose.model("Session", sessionSchema);
