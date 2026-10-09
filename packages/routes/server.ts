import express, {} from "express";
import corsMiddleware from "./middleware/cors";
import commentRouter from "./routes/comment";
import errorHandler from "./middleware/errorHandler";
import { stdin } from "node:process";
import fs from "node:fs";
stdin.setEncoding("utf-8");

const app = express();
const PORT = 5000;

if (!fs.existsSync("./data/comments.json")) {
  console.log("database doesnot exist, creating now...");
  !fs.existsSync("./data") && fs.mkdirSync("./data");

  fs.writeFileSync("./data/comments.json", "{}");
}

app.use(corsMiddleware);

app.use(express.json());

app.use("/api/comment", commentRouter);

app.get("/", (_req, res) => {
  res.send("Hello, World!");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});

stdin.on("data", (data) => {
  if (data === "clear\n" || data === "c\n") {
    console.clear();
  }
});
