import { createUserLoader } from "./createUserLoader";

export type MyContext = {
  req: Request;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  //   postLoader: ReturnType<typeof createPostLoader>;
};
