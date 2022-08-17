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
import { AppDataSource } from "../DBConnection";
import { User } from "../entities/User";
import { EntityManager } from "typeorm";
import type { MyContext } from "../utils/MyContext";
import { isAuth } from "../middleware/isAuth";
import { HttpQueryError } from "apollo-server-core";

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
  connection: EntityManager = null;
  constructor() {
    this.connection = AppDataSource.manager;
  }
  @FieldResolver(() => User)
  creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(post.creator_id);
  }
  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getPost(
    @Arg("post_id", () => Int, { nullable: true }) post_id: string
  ) {
    if (post_id) {
      const post = await this.connection.find(Post, {
        where: { post_id },
      });
      return post;
    }
    const posts = await Post.find();
    return posts;
  }

  // INSERT INTO Post
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async createPost(
    @Ctx() { req }: MyContext,
    @Arg("options", () => PostInput) options: PostInput
  ) {
    try {
      const post = this.connection.create(Post, {
        creator_id: req.session.userId,
        ...options,
      });
      post.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
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
      const post = await Post.findOne({ where: { post_id } });
      if (post.creator_id != req.session.userId) {
        throw new HttpQueryError(403, "Forbidden");
      }
      await Post.update({ post_id }, { ...options });
      return true;
    } catch (error) {
      return false;
    }
  }

  //  REMOVE FROM Post
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async removePost(@Arg("post_id") post_id: string) {
    const post = await Post.findOne({ where: { post_id } });
    if (!post) return false;
    await post.remove();
    return true;
  }
}
