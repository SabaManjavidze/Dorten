import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});
export type loginSchemaType = z.infer<typeof loginSchema>;
