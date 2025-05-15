import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({message: "Unauthorized- No token provided"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({message: "Unauthorized- Invalid token"});
    }

    const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the user object (-password) option will be used to exclude the password field from the user object
    if (!user) {
      return res.status(401).json({message: "Unauthorized- User not found"});
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in auth middleware", error);
    return res.status(401).json({message: "Unauthorized"});
  }
};
