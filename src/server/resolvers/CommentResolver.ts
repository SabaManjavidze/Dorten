import { HttpQueryError } from "apollo-server-core";
import {
  Resolver,
  FieldResolver,
  Root,
  Ctx,
  Int,
  Query,
  Arg,
  Mutation,
} from "type-graphql";
import { zodComment } from "../../lib/zod/commentValidation";
import dataSource from "../DBConnection";
import { Comment } from "../entities/Comment";
import { User } from "../entities/User";
import type { MyContext } from "../utils/MyContext";

@Resolver(Comment)
export default class CommentResolver {
  commentRepository = dataSource.getRepository(Comment);

  @FieldResolver(() => User)
  creator(@Root() comment: Comment, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(comment.creator_id);
  }
  @FieldResolver(() => User)
  post(@Root() comment: Comment, @Ctx() { postsLoader }: MyContext) {
    return postsLoader.load(comment.post_id);
  }

  @Mutation(() => Comment)
  async addComment(
    @Ctx() { req }: MyContext,
    @Arg("text") text: string,
    @Arg("postId") postId: string
  ) {
    const validatedText = await zodComment.parseAsync(text);
    if (!validatedText) return null;

    const comment = await this.commentRepository
      .create({
        creator_id: req.session.userId,
        post_id: postId,
        text: validatedText,
      })
      .save();

    return comment;
  }
}
