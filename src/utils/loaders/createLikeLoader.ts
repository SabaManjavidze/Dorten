import DataLoader from "dataloader";

interface LikeKey {
  userId: string;
  postId: string;
}

export const createLikeLoader = () =>
  new DataLoader<LikeKey, Like | null>(async (keys) => {
    const likes = await dataSource.manager.findByIds(Like, keys as any);
    const likeIdsToLikes: Record<string, Like> = {};
    likes.forEach((item) => {
      likeIdsToLikes[`${item.postId}|${item.userId}`] = item;
    });
    return keys.map((keys) => likeIdsToLikes[`${keys.postId}|${keys.userId}`]);
  });
