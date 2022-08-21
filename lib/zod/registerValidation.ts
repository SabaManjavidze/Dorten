import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(5, "5 characters min").max(20, "20 characters max"),
  age: z.number().min(13).max(69),
  gender: z.enum(["Male", "Female", "None"]),
});
export type registerSchemaType = z.infer<typeof registerSchema>;
