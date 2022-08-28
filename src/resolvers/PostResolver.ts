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
import { dataSource } from "../DBConnection";

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
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creator_id);
  }
  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getPost(@Arg("post_id", { nullable: true }) post_id: string) {
    if (post_id) {
      const post = await this.postRepository.find({
        where: { post_id },
      });
      return post;
    }
    const posts = await this.postRepository.find();
    return posts;
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
