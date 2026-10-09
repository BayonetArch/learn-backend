import { z } from "zod";

const commentSchema = z.object({
  id: z.int().min(1, "id is required"),
  name: z.string().min(1, "name is required"),
  comment: z.string().min(1, "comment is required"),
});

export default commentSchema;
