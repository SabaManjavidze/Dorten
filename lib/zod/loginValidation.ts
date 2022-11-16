import { z } from "zod";
import { zodEmail, zodPassword } from "./zodTypes";

export const loginSchema = z.object({
  email: zodEmail,
  password: zodPassword,
});
export type loginSchemaType = z.infer<typeof loginSchema>;
