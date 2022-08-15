import { createPostLoader } from "./loaders/createPostLoader";
import { createUserLoader } from "./loaders/createUserLoader";

export type MyContext = {
  req: Request;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  postLoader: ReturnType<typeof createPostLoader>;
};
