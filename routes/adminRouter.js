import express from "express";
import { getAdminDashboardStats } from "../controllers/adminController.js";
import verifyJWT from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", verifyJWT, getAdminDashboardStats);

export default router;
