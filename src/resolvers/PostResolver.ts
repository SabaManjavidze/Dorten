import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { User } from "../entities/User";
import type { MyContext } from "../utils/MyContext";
import { isAuth } from "../middleware/isAuth";
import { HttpQueryError } from "apollo-server-core";
import dataSource from "../DBConnection";
import { Like } from "../entities/Like";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  picture: string;
}

@Resolver(Post)
export default class PostResolver {
  postRepository = dataSource.getRepository(Post);
  likeRepository = dataSource.getRepository(Like);

  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creator_id);
  }
  @FieldResolver(() => Int, { nullable: true })
  async likeStatus(@Root() post: Post, @Ctx() { likeLoader, req }: MyContext) {
    if (!req.session?.userId) return null;
    const like = await likeLoader.load({
      postId: post.post_id,
      userId: req.session.userId,
    });
    return like ? like.value : null;
  }

  @Query(() => [Post])
  async getPost(@Arg("post_id", { nullable: true }) post_id: string) {
    if (post_id) {
      const post = await this.postRepository.find({
        where: { post_id },
      });
      return post;
    }
    const posts = await this.postRepository.find();
    return posts
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async likePost(
    @Ctx() { req }: MyContext,
    @Arg("value", () => Int) value: number,
    @Arg("postId") postId: string
  ) {
    // check if user has already liked/disliked the post
    const like = await this.likeRepository.findOne({
      where: { postId, userId: req.session.userId },
    });
    // make sure that the value is either -1 or 1
    let realValue = value > 0 ? 1 : -1;

    // check if the postId is valid
    const post = await this.postRepository.findOne({
      where: { post_id: postId },
    });
    if (!post) return false;

    // a user can't like his/her own post
    if (post.creator_id == req.session.userId) return false;

    // if the user has already liked and is changing the value double up that value
    if (like) {
      if (like.value == realValue) return false;

      await this.likeRepository.update(
        { postId: like.postId, userId: req.session.userId },
        { value: realValue }
      );
      await this.postRepository.update(
        { post_id: postId },
        { points: post.points + realValue * 2 }
      );
      return true;
    } else {
      // add this to likes
      await this.likeRepository
        .create({ postId, userId: req.session.userId, value: realValue })
        .save();
      // increment points on the post
      await this.postRepository.update(
        { post_id: postId },
        { points: post.points + realValue }
      );
    }
    return true;
  }

  // INSERT INTO Post
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Ctx() { req }: MyContext,
    @Arg("options", () => PostInput) options: PostInput
  ) {
    if (!options.title) throw new HttpQueryError(400, "title not provided");
    try {
      const post = this.postRepository.create({
        creator_id: req.session.userId,
        ...options,
      });
      await post.save();
      return post;
    } catch (error) {
      throw new HttpQueryError(400, "Bad Request");
    }
  }

  // UPDATE USER
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg("post_id", () => ID) post_id: string,
    @Arg("options", () => PostInput) options: PostInput,
    @Ctx() { req }: MyContext
  ) {
    try {
      const post = await this.postRepository.findOne({ where: { post_id } });
      if (post?.creator_id != req.session.userId) {
        throw new HttpQueryError(403, "Forbidden");
      }
      await this.postRepository.update({ post_id }, { ...options });
      return true;
    } catch (error) {
      return false;
    }
  }

  //  REMOVE FROM Post
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removePost(@Arg("post_id") post_id: string) {
    const post = await this.postRepository.findOne({ where: { post_id } });
    if (!post) return false;
    await post.remove();
    return true;
  }
}
