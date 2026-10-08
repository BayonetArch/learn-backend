import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { z } from "zod";

const app = express();
const PORT = 5000;

const commentSchema = z.object({
  name: z.string().min(1, "name is required"),
  comment: z.string().min(1, "comment is required"),
});

function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: `Validation failed: make sure that name and comment field are present`,
        issues: result.error.issues.map((i) => ({
          path: i.path.join(""),
          message: i.message,
        })),
      });
      console.error(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
}

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, req.url);

  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post(
  "/api/comment",
  validateBody(commentSchema),
  (req: Request, res: Response) => {
    const body = req.body;

    console.log("GOT BODY:", body);

    res.json({ ok: true, name: body.name, comment: body.comment });
  },
);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
