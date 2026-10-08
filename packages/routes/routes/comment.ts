import { Router, type Request, type Response } from "express";
import validateBody from "../middleware/validate";
import commentSchema from "../schemas/commentSchema";

const commentRouter = Router();

/* GET /api/comment/ */
commentRouter.get("/", (_req, res) => {
  res.json({ ok: true, comments: "Loading... later" });
});

/* GET /api/comment/:id */
commentRouter.get("/:id", (_req, res) => {
  res.json({ ok: true, comment: "Loading... ID later" });
});

/* POST /api/comment/ */
commentRouter.post(
  "/",
  validateBody(commentSchema),
  (req: Request, res: Response) => {
    const body = req.body;
    console.log("GOT BODY:", body);
    const { _, name, comment } = body;
    res.json({ ok: true, got: body });
  },
);

export default commentRouter;
