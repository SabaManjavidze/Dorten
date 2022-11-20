import { z } from "zod";

export const zodComment = z.string().min(1);
// export type commentSchemaType = z.infer<typeof commentSchema>;
