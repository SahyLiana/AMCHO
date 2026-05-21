import prisma from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getProfile = (req, res) => {
  try {
    //Getting the user attached from the middleware
    const user = req.user;
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    //Get user input
    const { username, password } = req.body;

    // Validate inputs
    if (!username.trim() || !password.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Locate the user profile
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }, // Token expires in 24 hours
    );

    // Send token inside an HttpOnly Cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(" Login Failure:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("auth_token");
  return res.status(200).json({ message: "Logout successful" });
};
