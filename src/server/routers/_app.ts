import { router } from "./index";
import { commentRouter } from "./sub-routes/comment.route";
import { postRouter } from "./sub-routes/post.route";
import { userRouter } from "./sub-routes/user.route";
export const appRouter = router({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
