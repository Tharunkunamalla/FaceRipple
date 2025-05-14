import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {upsertStreamUser} from "../lib/stream.js";

export async function signup(req, res) {
  const {email, password, fullName} = req.body;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|ac\.in|edu\.in)$/;

  // Regular expression to validate email format
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({message: "Please fill all the fields"});
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({message: "Password must be at least 6 characters"});
    }

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({message: "Please enter a valid email address"});
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res
        .status(400)
        .json({message: "Email already exists, please use another one"});
    }
    // Generate a random avatar URL
    // const randomAvatar = `https://api.adorable.io/avatars/285/${email}.png`;
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    //# creating a new user
    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic,
      });
      console.log(`Stream user created successfully for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error in creating user sin stream chat", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    //# to create a token
    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    // to save the user in the database
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    });
    // to save the user in the database
    res.status(201).json({
      succes: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

//# For creating the user in stream chat

export async function login(req, res) {
  // Handle login logic here
  // res.send("Login Route");
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({message: "Please fill all the fields"});
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({message: "Invalid email or password"});
    }
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({message: "Invalid email or password"});
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevents XSS attacks
      sameSite: "strict", // prevents CSRF attacks
      secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in production
    });

    res.status(200).json({success: true, user});
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
export function logout(req, res) {
  // Handle logout logic here
  // res.send("Logout Route");
  // jwt name comes from the cookie parameter name
  res.clearCookie("jwt");
  res.status(200).json({success: true, message: "Logged out successfully"});
}

export async function onboard(req, res) {
  const {fullName, avatar} = req.body;
  if (!fullName || !avatar) {
    return res.status(400).json({message: "Please fill all the fields"});
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    user.fullName = fullName;
    user.profilePic = avatar;
    await user.save();
    res.status(200).json({success: true, user});
  } catch (error) {
    console.log("Error in onboarding controller", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
