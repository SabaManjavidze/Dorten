import { z } from "zod";

export const zodEmail = z.string().email();
export const zodPassword = z.string().min(8).max(20);
