import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {
  getFriends,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";
const router = express.Router();

//apply the protectRoute middleware to all routes in this router
router.use(protectRoute);
router.get("/", getRecommendedUsers);
router.get("/friends", getFriends);

router.post("/friend-request/:id", sendFriendRequest);

export default router;
