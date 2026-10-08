import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

export default function validateBody(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: `Validation failed: make sure that id, name and comment field are present`,
        issues: result.error.issues.map((i) => ({
          field: i.path.join(""),
          message: i.message,
        })),
      });
      console.error("Could not valid the request Body\n", result.error);
      return;
    }

    req.body = result.data;
    next();
  };
}
