import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    // friend requests sent by the user and thier nums saved in array
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // to add createdAt and updatedAt fields
    // to the schema
    timestamps: true,
  }
);

// for password hashing

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // if the password is not modified, skip hashing
    // this is to prevent hashing the password again when updating the user
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  // this is to compare the password entered by the user with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};
// this should be below the userSchema then the model gets password hashed
const User = mongoose.model("User", userSchema);

export default User;
