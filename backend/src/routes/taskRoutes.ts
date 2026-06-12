import express from "express";
import { TaskController } from "../controllers/taskController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";
import { adapt } from "../utils/adapt.ts";

const router = express.Router();

// wrap authMiddleware in case it's not typed as RequestHandler
router.use(adapt(authMiddleware));

router.get("/getask", adapt(TaskController.getTasks));
router.get("/history", adapt(TaskController.getHistory));
router.post("/createtask", adapt(TaskController.createTask));
router.get("/gettrash", adapt(TaskController.getTrash));
router.put("/trash/:id", adapt(TaskController.recentDeletedTask))
router.put("/updatetask/:id", adapt(TaskController.updateTask));
router.delete("/deletetask/:id", adapt(TaskController.deleteTask));

export default router;