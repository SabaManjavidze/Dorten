import DataLoader from "dataloader";
import { In } from "typeorm";
import { Post } from "../../entities/Post";

export const createUserPostsLoader = () =>
  new DataLoader<string, Post[]>(async (userIds) => {
    const posts = await Post.find({
      where: {
        creator_id: In(userIds as string[]),
      },
    });
    const userIdToPost: Record<string, Post[]> = {};
    posts.forEach((item) => {
      if (item.creator_id in userIdToPost) {
        userIdToPost[item.creator_id].push(item);
      } else {
        userIdToPost[item.creator_id] = [item];
      }
    });
    const sortedPosts = userIds.map((userId) => userIdToPost[userId]);
    return sortedPosts;
  });
