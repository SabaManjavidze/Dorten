import { z } from "zod";
import { zodComment } from "../../../lib/zod/commentValidation";
import { procedure, router } from "../index";
import { prisma } from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

export const commentRouter = router({
  getReplies: procedure
    .input(
      z.object({
        main_comment_id: z.string(),
      })
    )
    .query(async ({ input: { main_comment_id }, ctx: { req } }) => {
      const replies = await prisma.comment.findMany({
        where: { main_comment_id },
        include: { creator: true },
      });
      console.log({ main_comment_id, replies });
      return replies;
    }),
  addComment: procedure
    .input(
      z.object({
        text: zodComment,
        post_id: z.string(),
        main_comment_id: z.string().optional(),
      })
    )
    .mutation(
      async ({ input: { post_id, text, main_comment_id }, ctx: { req } }) => {
        const comment = await prisma.comment.create({
          data: {
            creator_id: req.session.userId,
            post_id,
            text,
            main_comment_id,
          },
        });

        return comment;
      }
    ),
});
