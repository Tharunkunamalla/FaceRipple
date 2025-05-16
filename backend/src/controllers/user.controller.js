import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const recommendedUsers = await User.find({
      $and: [
        {_id: {$ne: currentUserId}}, // Exclude the current user
        {_id: {$nin: currentUser.friends}}, // Exclude friends
        {isOnboarded: true}, // Only include users who have completed onboarding
      ],
    });
    res.status(200).json({
      success: true,
      message: "Recommended users fetched successfully",
      recommendedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage"
      );

    res.status(200).json({
      success: true,
      message: "Friends fetched successfully",
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const {id: recipientId} = req.params;

    //prevent sending friend request to yourself
    if (myId === recipientId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }
    // Check if the recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found",
      });
    }

    // Check if the recipient is already a friend
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({
        success: false,
        message: "You are already friends with this user",
      });
    }

    // Check if a friend request already exists between the two users
    const existingRequest = await FriendRequest.findOne({
      $or: [
        {sender: myId, recipient: recipientId},
        {sender: recipientId, recipient: myId},
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists between you and this user",
      });
    }
    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
