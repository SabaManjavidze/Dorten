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
    // const posts = await dataSource.manager.find(Like, {
    //   where: [
    //     {
    //       postId: In(keys as LikeKey[]),
    //     },
    //     {
    //       userId: In(keys as LikeKey[]),
    //     },
    //   ],
    // });
    /*
     const query = Like.createQueryBuilder("like")
     .leftJoinAndSelect

     select * from like as l
     left join public.user as u on l.userId=u.user_id
     left join post as p on l.postId=p.post_id
     where p.post_id in :keys and u.userId in :keys
    */
    const posts = await dataSource.manager.findByIds(Like, keys as any);
    console.log({ posts });
    const likeIdsToLikes: Record<string, Like> = {};
    posts.forEach((item) => {
      likeIdsToLikes[`${item.postId}|${item.userId}`] = item;
    });
    return keys.map((keys) => likeIdsToLikes[`${keys.postId}|${keys.userId}`]);
  });
