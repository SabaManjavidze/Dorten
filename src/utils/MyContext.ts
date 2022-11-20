import { IncomingMessage, ServerResponse } from "http";
import { Session, SessionRecord } from "next-session/lib/types";
import {
  createLikeLoader,
  createPostCommentLoader,
  createPostLoader,
  createUserLoader,
  createUserPostsLoader,
} from "./loaders";

export type MyContext = {
  req: IncomingMessage & {
    session: Session<SessionRecord> & {
      userId: string;
      emailVerificationToken: number | null;
    };
  };
  res: ServerResponse;
  userLoader: ReturnType<typeof createUserLoader>;
  userPostsLoader: ReturnType<typeof createUserPostsLoader>;
  postCommentLoader: ReturnType<typeof createPostCommentLoader>;
  postsLoader: ReturnType<typeof createPostLoader>;
  likeLoader: ReturnType<typeof createLikeLoader>;
};
