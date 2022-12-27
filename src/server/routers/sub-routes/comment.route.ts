import { z } from "zod";
import { zodComment } from "../../../../lib/zod/commentValidation";
import { procedure, router } from "../index";
import { prisma } from "../../../utils/prisma";

export const commentRouter = router({
  addComment: procedure
    .input(
      z.object({
        text: zodComment,
        post_id: z.string(),
      })
    )
    .mutation(async ({ input: { post_id, text }, ctx: { req } }) => {
      const comment = await prisma.comment.create({
        data: {
          creator_id: req.session.userId,
          post_id,
          text,
        },
      });

      return comment;
    }),
});
