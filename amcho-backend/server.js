// console.log("test");

import express from "express";
import dotenv from "dotenv";
import cocoaRoute from "./routes/cocoa.route.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import cors from "cors";

// 1. Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow React frontend to communicate with your API
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// 2. Global Middleware
app.use(express.json());
app.use(cookieParser());

// 3. Register your API Routes
app.use("/api/cocoa", cocoaRoute);
app.use("/api/auth", authRoute);

// 4. Start listening (Always place this at the very bottom)
app.listen(PORT, () => {
  console.log(`🚀 Server safely running on port ${PORT}`);
});
