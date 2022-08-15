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
} from "type-graphql";
import { AppDataSource } from "../DBConnection";
import { User } from "../entities/User";
import { EntityManager } from "typeorm";
import type { MyContext } from "../utils/MyContext";

@InputType()
class PostInput {
  @Field()
  creator_id: string;
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
  async getPost(
    @Arg("post_id", () => Int, { nullable: true }) post_id: string
  ) {
    if (post_id) {
      const post = await this.connection.find(Post, {
        where: { post_id },
      });
      return post;
    }
    // const posts = await Post.createQueryBuilder("post")
    //   .leftJoinAndSelect("post.creator", "user")
    //   .getMany();
    const posts = await Post.find();
    console.log(posts);
    return posts;
  }

  // INSERT INTO Post
  @Mutation(() => Boolean)
  async createPost(@Arg("options", () => PostInput) options: PostInput) {
    try {
      const post = this.connection.create(Post, { ...options });
      post.save();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // UPDATE USER
  @Mutation(() => Boolean)
  async updatePost(
    @Arg("post_id", () => ID) post_id: string,
    @Arg("options", () => PostInput) options: PostInput
  ) {
    try {
      await Post.update({ post_id }, { ...options });
      return true;
    } catch (error) {
      return false;
    }
  }

  //  REMOVE FROM Post
  @Mutation(() => Boolean)
  async removePost(@Arg("post_id") post_id: string) {
    const post = await Post.find({ where: { post_id } });
    if (!post) return false;
    await post[0].remove();
    return true;
  }
}
