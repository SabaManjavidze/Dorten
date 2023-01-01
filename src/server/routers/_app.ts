import { z } from "zod";
import { isAuthed } from "../middleware/isAuth";
import { procedure, router } from "./index";
import { commentRouter } from "./sub-routes/comment.route";
import { postRouter } from "./sub-routes/post.route";
import { userRouter } from "./sub-routes/user.route";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";

config();

export const appRouter = router({
  user: userRouter,
  post: postRouter,
  comment: commentRouter,
  deleteImage: procedure
    .use(isAuthed)
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ input: { imageId } }) => {
      // delete image by id
      await cloudinary.uploader.destroy(imageId, {
        invalidate: true,
      });
      // console.log({result})
    }),
  uploadImage: procedure
    .use(isAuthed)
    .input(z.object({ picture: z.string() }))
    .mutation(async ({ input }) => {
      const result = await cloudinary.uploader.upload(input.picture);
      console.log({ result });
      if (!result) return;
      return result;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
