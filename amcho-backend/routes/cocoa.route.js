import express from "express";
// import prisma from "../db.js";
import { getAllCocoa } from "../controllers/cocoa.controller.js";
import { protectRoute } from "../middleware/authGuard.js";

const router = express.Router();

//Getting all data needed for analytics in the dashboard
router.get("/", protectRoute, getAllCocoa);

export default router;
