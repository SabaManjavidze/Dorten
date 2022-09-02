import { FormState } from "react-hook-form";
import { registerSchemaType } from "../lib/zod/registerValidation";

export default function InvalidText({
  message,
}: {
  message: string | null | undefined;
}) {
  if (message) return null;
  return (
    <p className="absolute top-0 flex items-center text-sm text-red-500">
      {message ? (
        <div className="mr-5 h-[5px] w-[5px] rounded-full bg-red-500"></div>
      ) : null}
      {message}
    </p>
  );
}
