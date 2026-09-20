import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * creating the Schema
 */
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      lowercase: true,
      minlength: [3, "Username should be at least than 3 length"],
      maxlength: [23, "Username should less than 23"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Username should be greater than 8 length"],
      select:false
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

/**
 * this is the middleware for saving the password
 */

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log("Password function is called successfully!");
  } catch (error) {
    next(error);
  }
});

/**
 * for comparing the password
 */
UserSchema.methods.passwordCompare = async function (password) {
  try {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
  } catch (error) {
    console.log(error);
  }
};

/**
 * for generating the access token
 */

UserSchema.methods.generateAccessToken = function () {
  try {
    const token = jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * for generating the refreshToken
 */

UserSchema.methods.generateRefreshToken = function () {
  try {
    const token = jwt.sign(
      {
        _id: this._id.toString(),
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
    return token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * creating the model of user
 */

const User = mongoose.model("user", UserSchema);

export default User;
