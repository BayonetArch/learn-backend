import { type Request, type Response, type NextFunction } from "express";

export default function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON body" });
    return;
  }

  console.error("got error while handling request\n", err);
  res.status(500).json({ error: "Something went wrong" });
}
