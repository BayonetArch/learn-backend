import express, {} from "express";
import corsMiddleware from "./middleware/cors";
import commentRouter from "./routes/comment";
import errorHandler from "./middleware/errorHandler";
import { stdin } from "node:process";
stdin.setEncoding("utf-8");

const app = express();
const PORT = 5000;

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
