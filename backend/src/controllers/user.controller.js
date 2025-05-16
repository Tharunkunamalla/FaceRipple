// this file contains the logic for user-related operations
// such as getting recommended users, getting friends, and sending friend requests
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

export async function acceptFriendRequest(req, res) {
  try {
    const {id: recipientId} = req.params;
    const friendRequest = await FriendRequest.findById(recipientId);
    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found",
      });
    }

    // verify the current user is the recipient of the friend request
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this friend request",
      });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the other's friends array
    // $addToSet is used to prevent duplicates
    // this is done by updating the friends array of both users
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: {friends: req.user.id},
    });
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: {friends: friendRequest.sender},
    });
    // remove the friend request from the database
    await FriendRequest.findByIdAndDelete(friendRequest.id);
    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getFriendRequests(req, res) {
  try {
    // Get incoming friend requests for the current user
    // and outgoing friend requests sent by the current user
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    })
      .populate("sender", "fullName profilePic nativeLanguage learningLanguage")
      .select("-__v");
    // populate the sender field with the user's data
    // and exclude the __v field from the response
    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({incomingReqs, acceptedReqs});
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    // Get outgoing friend requests sent by the current user
    const outgoingReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    res.status(200).json({outgoingReqs});
  } catch (error) {
    console.error("Error fetching outgoing friend requests:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
