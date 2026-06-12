import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/authRoutes.ts";
import taskRoutes from "./src/routes/taskRoutes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// register middleware before routes so CORS and body parsing apply to all routes
app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", taskRoutes)

app.get("/", (req, res) => {
  res.send("It is working");
});

console.log("My port:", PORT)

app.listen(PORT ,() => {
  console.log("Server is running on port", PORT);
});

