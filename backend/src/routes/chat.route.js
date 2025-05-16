// This file define the routes for chat-related operations in the application.
// It uses Express to define the routes and middleware for authentication.
import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getStreamToken} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
export default router;
