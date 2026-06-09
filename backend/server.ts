import express from "express";
import dotenev from "dotenv";

dotenev.config();

const app = express();
const PORT = process.env.PORT;

app.get ("/", (req, res) => {
  res.send("It is working");
});

console.log("My port:", PORT)

app.listen(PORT ,() => {
  console.log("Server is running on port", PORT);
});

