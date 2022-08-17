import { IncomingMessage } from "http";
import { Session, SessionRecord } from "next-session/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { createPostLoader } from "./loaders/createPostLoader";
import { createUserLoader } from "./loaders/createUserLoader";

export type MyContext = {
  req: IncomingMessage & {
    session?: Session<SessionRecord>;
  };
  res: NextResponse;
  userLoader: ReturnType<typeof createUserLoader>;
  postLoader: ReturnType<typeof createPostLoader>;
};
