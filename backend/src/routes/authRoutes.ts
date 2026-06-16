import express from "express";
import { login, register, getProfile, updateAccount } from "../controllers/authController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { adapt } from "../utils/adapt.ts";

const router = express.Router();


router.post("/auth/register", register);
router.post("/auth/login", login);

router.use(adapt(authMiddleware));
router.get("/auth/profile", adapt(getProfile));
router.put("/auth/update", adapt(updateAccount));

export default router;