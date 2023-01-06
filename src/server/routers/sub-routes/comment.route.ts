import { z } from "zod";
import { zodComment } from "../../../lib/zod/commentValidation";
import { procedure, router } from "../index";
import { prisma, UserFragment } from "../../../utils/prisma";
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
        include: {
          main_comment: {
            select: {
              comment_id: true,
              creator: { select: { username: true } },
            },
          },
          creator: { select: UserFragment },
          _count: true,
        },
        orderBy: { created_at: "desc" },
      });
      return replies;
    }),
  deleteComment: procedure
    .input(
      z.object({
        comment_id: z.string(),
      })
    )
    .mutation(async ({ input: { comment_id } }) => {
      const comment = await prisma.comment.delete({
        where: { comment_id },
      });

      return comment;
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
