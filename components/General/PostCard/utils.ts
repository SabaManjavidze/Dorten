import { ApolloCache } from "@apollo/client";
import {
  GetPostsDocument,
  GetPostsQuery,
  Post,
} from "../../../graphql/generated";

export const updateCache = (
  cache: ApolloCache<any>,
  post: Post,
  likeValue: number
) => {
  const posts = cache.readQuery<GetPostsQuery>({
    query: GetPostsDocument,
    variables: { post_id: "" },
  });
  if (!posts) {
    return;
  }
  cache.writeQuery({
    query: GetPostsDocument,
    variables: { post_id: "" },
    data: {
      getPost: posts.getPost.map((postItem) => {
        if (postItem.post_id === post.post_id) {
          if (postItem?.likeStatus == likeValue) {
            return {
              ...postItem,
              points: postItem.points - likeValue,
              likeStatus: 0,
            };
          }
          if (postItem?.likeStatus === 0) {
            return {
              ...postItem,
              points: postItem.points + likeValue,
              likeStatus: likeValue,
            };
          } else {
            return {
              ...postItem,
              points: postItem.points + likeValue * 2,
              likeStatus: likeValue,
            };
          }
        }
        return postItem;
      }),
    },
  });
};
