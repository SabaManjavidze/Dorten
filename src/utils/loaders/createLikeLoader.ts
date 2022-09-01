import DataLoader from "dataloader";
import { In } from "typeorm";
import dataSource from "../../DBConnection";
import { Like } from "../../entities/Like";

interface LikeKey {
  userId: string;
  postId: string;
}

export const createLikeLoader = () =>
  new DataLoader<LikeKey, Like | null>(async (keys) => {
    const posts = await dataSource.manager.find(Like, {
      relations: {
        post: true,
        user: true,
      },
      where: {
        postId: In(keys as LikeKey[]),
        userId: In(keys as LikeKey[]),
      },
    });
    const likeIdsToLikes: Record<string, Like> = {};
    posts.forEach((item) => {
      likeIdsToLikes[`${item.postId}|${item.userId}`] = item;
    });
    return keys.map((keys) => likeIdsToLikes[`${keys.postId}|${keys.userId}`]);
  });
