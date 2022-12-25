import DataLoader from "dataloader";
import { In } from "typeorm";
import { Post } from "../../server/entities/Post";
import { User } from "../../server/entities/User";

export const createPostLoader = () =>
  new DataLoader<string, Post>(async (postIds) => {
    const posts = await Post.find({
      where: {
        post_id: In(postIds as string[]),
      },
    });
    const postIdToPost: Record<string, Post> = {};
    posts.forEach((p) => {
      postIdToPost[p.post_id] = p;
    });

    const sortedUsers = postIds.map((postId) => postIdToPost[postId]);
    return sortedUsers;
  });
