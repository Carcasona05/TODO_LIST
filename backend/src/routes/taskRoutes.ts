import express from "express";
import { TaskController } from "../controllers/taskController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/getask", TaskController.getTasks);
router.post("/createtask", TaskController.createTask);
router.put("/updatetask/:id", TaskController.updateTask);
router.delete("/deletetask/:id", TaskController.deleteTask);

export default router;