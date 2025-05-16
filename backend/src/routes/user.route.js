import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
  getFriends,
  getRecommendedUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
} from "../controllers/user.controller.js";
const router = express.Router();

//apply the protectRoute middleware to all routes in this router
router.use(protectRoute);

// Todo: Add a Reject Friend Request route
// Define routes
router.get("/", getRecommendedUsers);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;
