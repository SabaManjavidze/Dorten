import { z } from "zod";
import { zodPassword } from "./zodTypes";

export const changePassSchema = z
  .object({
    pass1: zodPassword,
    pass2: zodPassword,
  })
  .refine((data) => data.pass1 === data.pass2, {
    message: "Passwords should match",
    path: ["pass2"],
  });
export type changePassSchemaType = z.infer<typeof changePassSchema>;
