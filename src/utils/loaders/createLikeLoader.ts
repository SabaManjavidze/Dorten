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
    const posts = await dataSource.manager.findByIds(Like, keys as any);
    const likeIdsToLikes: Record<string, Like> = {};
    posts.forEach((item) => {
      likeIdsToLikes[`${item.postId}|${item.userId}`] = item;
    });
    return keys.map((keys) => likeIdsToLikes[`${keys.postId}|${keys.userId}`]);
  });
