import { Router, type Request, type Response } from "express";
import validateBody from "../middleware/validate";
import commentSchema from "../schemas/commentSchema";
import fs from "node:fs";
import assert from "node:assert";

const commentRouter = Router();

/* GET /api/comment/ */
commentRouter.get("/", (_req, res) => {
  const read = fs.readFileSync("./data/comments.json").toString();
  const comments = JSON.parse(read);
  res.json({ ok: true, comments });
});

/* GET /api/comment/:id */
commentRouter.get("/:id", (req, res) => {
  const read = fs.readFileSync("./data/comments.json").toString();
  const comments = JSON.parse(read);
  const id = req.params.id;

  if (!(id in comments)) {
    res.status(404).json({ ok: false, error: "ID not found" });
    return;
  }

  res.json({ ok: true, comment: comments[id] });
});

function handlePostRequest(req: Request, res: Response) {
  const body = req.body;
  const read = fs.readFileSync("./data/comments.json");
  assert(read, "The database json is empty");

  let comments;
  try {
    comments = JSON.parse(read.toString());
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: `Could not parse the database from json file: ${e.message}`,
    });
  }

  if (body.id in comments) {
    console.log("request body's ID already exists");
    res.json({ ok: false, error: "ID already exists" });
    return null;
  }
  comments[body.id] = { name: body.name, comment: body.comment };

  fs.writeFileSync("./data/comments.json", JSON.stringify(comments, null, 2));
  console.log("Database updated", comments);
}

/* POST /api/comment/ */
commentRouter.post(
  "/",
  validateBody(commentSchema),
  (req: Request, res: Response) => {
    const body = req.body;
    if (handlePostRequest(req, res) === null) return;

    res.json({ ok: true, got: body });
  },
);

commentRouter.delete("/:id", (req, res) => {
  const read = fs.readFileSync("./data/comments.json").toString();
  const comments = JSON.parse(read);
  const id = req.params.id;

  if (!(id in comments)) {
    res.status(404).json({ ok: false, error: "ID not found" });
    return;
  }
  delete comments[id];
  fs.writeFileSync("./data/comments.json", JSON.stringify(comments, null, 2));
  res.json({ ok: true, deleted: id });
  console.log("Deleted ID", id);
});

export default commentRouter;
