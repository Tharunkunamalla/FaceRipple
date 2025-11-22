// This file defines the friend request model for the application.
// It uses Mongoose to define the schema and model for friend requests.

import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Add compound indexes for efficient friend request queries
friendRequestSchema.index({ recipient: 1, status: 1 }); // For incoming requests
friendRequestSchema.index({ sender: 1, status: 1 }); // For outgoing requests
friendRequestSchema.index({ sender: 1, recipient: 1 }); // For checking existing requests

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
