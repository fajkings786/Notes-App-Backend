import jwt from "jsonwebtoken";
import User from "../models/User.models.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const user = await User.findById(decoded.userId);
    req.user = user;
    console.log("your current user is:");
    console.log(req.user)
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: error?.message || "Invalid Access Token" });
  }
};

export default authenticate