import {
  GiSharpSmile as LikeIcon,
  GiSharpAxe as DislikeIcon,
} from "react-icons/gi";
import { FaSlideshare as ShareIcon } from "react-icons/fa";
import { AiOutlineComment as CommentIcon } from "react-icons/ai";
import {
  GetPostsDocument,
  GetPostsQuery,
  MeDocument,
  Post,
  useLikePostMutation,
  useMeQuery,
} from "../../graphql/generated";
import IconButton from "./IconBtn";
import { useApolloClient } from "@apollo/client";

export default function LCS({ post }: { post: Post }) {
  const { loading: userLoading, data: userData } = useMeQuery();
  console.log({ userData });
  let likeValue = 0;
  const [likePost, { loading }] = useLikePostMutation({
    update(cache) {
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
              if (!postItem?.likeStatus) {
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
    },
  });
  const likePostHandler = async (value: -1 | 1) => {
    likeValue = value;
    if (value == post.likeStatus) return;
    await likePost({
      variables: {
        postId: post.post_id,
        value,
      },
    });
  };
  if (userLoading) return <p>loading...</p>;
  const isMyPost = post.creator.user_id == userData?.me?.user?.user_id;
  return (
    <div className="mt-4 flex w-4/5 items-center justify-between">
      <div className="flex items-center justify-between">
        <IconButton
          onClick={() => likePostHandler(1)}
          hoverColor="green"
          disabled={isMyPost || loading}
          fill={
            post.likeStatus
              ? post.likeStatus > 0
                ? "text-skin-like"
                : undefined
              : undefined
          }
          Icon={LikeIcon}
          size="30px"
        />
        <h3 className="m-0 p-0 px-2 text-left text-pink-200">
          {post.points || 0}
        </h3>
        <IconButton
          onClick={() => likePostHandler(-1)}
          hoverColor="pink"
          disabled={isMyPost || loading}
          fill={
            post.likeStatus
              ? post.likeStatus > 0
                ? undefined
                : "text-skin-dislike"
              : undefined
          }
          Icon={DislikeIcon}
          size="30px"
        />
      </div>
      <IconButton Icon={CommentIcon} text={8} size="30px" />
      <IconButton Icon={ShareIcon} text={"share"} size="30px" />
    </div>
  );
}
