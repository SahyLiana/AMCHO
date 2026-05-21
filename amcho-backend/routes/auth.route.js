import { protectRoute } from "../middleware/authGuard.js";
import { login, logout, getProfile } from "../controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
//Getting user profile
router.get("/me", protectRoute, getProfile);

export default router;
