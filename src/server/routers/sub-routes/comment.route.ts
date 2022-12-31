import { z } from "zod";
import { zodComment } from "../../../../lib/zod/commentValidation";
import { procedure, router } from "../index";
import { prisma } from "../../../utils/prisma";
import { Prisma } from "@prisma/client";

type createCommentInputType =
  | (Prisma.Without<
      Prisma.commentCreateInput,
      Prisma.commentUncheckedCreateInput
    > &
      Prisma.commentUncheckedCreateInput)
  | (Prisma.Without<
      Prisma.commentUncheckedCreateInput,
      Prisma.commentCreateInput
    > &
      Prisma.commentCreateInput);
export const commentRouter = router({
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
