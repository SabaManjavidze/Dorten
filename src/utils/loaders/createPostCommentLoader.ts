import DataLoader from "dataloader";
import { In } from "typeorm";
import { Comment } from "../../server/entities/Comment";

export const createPostCommentLoader = () =>
  new DataLoader<string, Comment[]>(async (postIds) => {
    const posts = await Comment.find({
      where: {
        post_id: In(postIds as string[]),
      },
    });
    const postIdToComment: Record<string, Comment[]> = {};
    posts.forEach((item) => {
      if (item.post_id in postIdToComment) {
        postIdToComment[item.post_id].push(item);
      } else {
        postIdToComment[item.post_id] = [item];
      }
    });
    const sortedComments = postIds.map((postId) => postIdToComment[postId]);
    return sortedComments;
  });
