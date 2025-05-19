const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Add to prevent duplicates
    trim: true,
  },
  password: {
    type: String,
    required: false, // Not required for Google OAuth users
  },
  contact: {
    type: String,
    required: false, // Optional for Google OAuth users
  },
  token: {
    type: String,
  },
  CardAdded: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "credit_cards",
    },
  ],
  googleId: {
    type: String, // For Google login
  },
});

module.exports = mongoose.model("User", userSchema);
