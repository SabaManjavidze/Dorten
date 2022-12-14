import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../index";
import { isAuthed } from "../../middleware/isAuth";
import { prisma, UserFragment } from "../../../utils/prisma";

export const postRouter = router({
  updatePost: procedure
    .input(
      z.object({
        post_id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        picture: z.string().optional(),
      })
    )
    .query(
      async ({
        input: { post_id, description, picture, title },
        ctx: { req },
      }) => {
        const post = await prisma.post.findFirst({ where: { post_id } });
        if (post?.creator_id != req.session.userId) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await prisma.post.update({
          where: { post_id },
          data: { description, picture, title },
        });
        return true;
      }
    ),
  removePost: procedure
    .input(
      z.object({
        post_id: z.string(),
      })
    )
    .query(async ({ input: { post_id }, ctx: { req } }) => {
      await prisma.post.delete({ where: { post_id } });
      return true;
    }),

  getPost: procedure
    .input(z.object({ post_id: z.string() }))
    .query(async ({ input: { post_id }, ctx: { req } }) => {
      const post = await prisma.post.findFirst({
        include: {
          creator: true,
          like: { select: { value: true } },
          comments: {
            include: {
              creator: { select: UserFragment },

              _count: { select: { replies: true } },
            },
            where: { main_comment_id: null },
            orderBy: { created_at: "desc" },
          },
        },
        where: { post_id },
      });
      return post;
    }),
  getPosts: procedure.query(async ({ input, ctx: { req } }) => {
    const posts = await prisma.post.findMany({
      include: {
        creator: { select: UserFragment },
        like: req.session.userId
          ? {
              where: { user_id: req.session.userId },
              select: { value: true },
            }
          : undefined,
        _count: { select: { comments: true } },
        comments: {
          where: { main_comment_id: null },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return posts;
  }),
  likePost: procedure
    .input(
      z.object({
        postId: z.string(),
        value: z.number(),
      })
    )
    .mutation(async ({ ctx: { req }, input: { postId, value } }) => {
      // check if user has already liked/disliked the post
      const like = await prisma.like.findFirst({
        where: { post_id: postId, user_id: req.session.userId },
      });
      // make sure that the value is either -1 or 1
      let realValue = value > 0 ? 1 : -1;

      // check if the postId is valid
      const post = await prisma.post.findFirst({
        where: { post_id: postId },
      });
      if (!post) return false;

      // a user can't like his/her own post
      if (post.creator_id == req.session.userId) return false;

      // if the user has already liked and is changing the value double up that value
      if (like) {
        if (like.value == realValue) {
          await prisma.like.update({
            where: {
              user_id_post_id: {
                post_id: like.post_id,
                user_id: req.session.userId,
              },
            },
            data: { value: 0 },
          });
          await prisma.post.update({
            where: { post_id: postId },
            data: { points: post.points - realValue },
          });
          return true;
        }

        const calcValue = like.value === 0 ? realValue : realValue * 2;
        await prisma.like.update({
          where: {
            user_id_post_id: {
              post_id: like.post_id,
              user_id: req.session.userId,
            },
          },
          data: { value: realValue },
        });
        await prisma.post.update({
          where: { post_id: postId },
          data: { points: post.points + calcValue },
        });
        return true;
      } else {
        // add this to likes
        await prisma.like.create({
          data: {
            post: { connect: { post_id: postId } },
            user: { connect: { user_id: req.session.userId } },
            value: realValue,
          },
        });
        // increment points on the post
        await prisma.post.update({
          where: { post_id: postId },
          data: { points: post.points + realValue },
        });
      }
      return true;
    }),
  createPost: procedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1).optional(),
        picture: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ ctx: { req }, input }) => {
      const post = await prisma.post.create({
        data: {
          ...input,
          creator: { connect: { user_id: req.session.userId } },
        },
      });
      return post;
    }),
});
