import { z } from "zod";
import { zodEmail, zodPassword } from "./zodTypes";

export const registerSchema = z.object({
  email: zodEmail,
  password: zodPassword,
  username: z.string().min(5, "5 characters min").max(20, "20 characters max"),
  age: z.number().min(13).max(69),
  gender: z.enum(["Male", "Female", "None"]),
});
export type registerSchemaType = z.infer<typeof registerSchema>;
