import { Post } from "../entities/Post";
import {
  Arg,
  Field,
  ID,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { AppDataSource } from "../DBConnection";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  picture: string;
}

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  async getPost(
    @Arg("post_id", () => Int, { nullable: true }) post_id: string
  ) {
    if (post_id) {
      const post = await AppDataSource.manager.find(Post, {
        where: { post_id },
      });
      return post;
    }
    const post = await Post.find();
    return post;
  }

  // INSERT INTO Post
  @Mutation(() => Post)
  async createPost(@Arg("options", () => PostInput) options: PostInput) {
    const post = AppDataSource.manager.create(Post, { ...options }).save();
    return post;
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
