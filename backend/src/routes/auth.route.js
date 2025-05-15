// this auth route is used to handle authentication related requests such as signup, login, logout, and onboarding. It uses the express router to define the routes and the corresponding controller functions to handle the requests. The protectRoute middleware is used to protect certain routes that require authentication. The router is then exported for use in the main server file.
import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
} from "../controllers/auth.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

// Checks if the user is logged in/ not
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
