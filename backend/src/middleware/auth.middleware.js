import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    // ✅ SAFE cookie access
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // ✅ Fetch user & remove password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not found",
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);

    return res.status(401).json({
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
