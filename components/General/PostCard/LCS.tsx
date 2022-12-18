import {
  GiSharpSmile as LikeIcon,
  GiSharpAxe as DislikeIcon,
} from "react-icons/gi";
import { FaSlideshare as ShareIcon } from "react-icons/fa";
import { AiOutlineComment as CommentIcon } from "react-icons/ai";
import {
  GetPostsDocument,
  GetPostsQuery,
  Post,
  useLikePostMutation,
  useMeQuery,
} from "../../../graphql/generated";
import IconButton from "./IconBtn";
import { useMemo, useState } from "react";
import CommentForm from "../CommentForm/CommentForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

let likeValue = 0;
export default function LCS({ post }: { post: Post }) {
  const { loading: userLoading, data: userData } = useMeQuery();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
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
    },
  });
  const likePostHandler = async (value: -1 | 1) => {
    if (!userData?.me?.user) return;
    likeValue = value;
    await likePost({
      variables: {
        postId: post.post_id,
        value,
      },
    });
  };
  if (userLoading) return <p>loading...</p>;
  const isMyPost = post.creator.user_id == userData?.me?.user?.user_id;
  const handleCommentClick = () => {
    setShowCommentForm(!showCommentForm);
  };
  return (
    <div className="flex w-4/5 flex-col">
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <IconButton
            onClick={() => likePostHandler(1)}
            hoverColor="green"
            disabled={isMyPost || loading}
            fill={
              post?.likeStatus && post?.likeStatus > 0
                ? "text-skin-like"
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
        <IconButton
          onClick={handleCommentClick}
          Icon={CommentIcon}
          text={post.comments?.length ?? 0}
          size="30px"
        />
        <IconButton Icon={ShareIcon} text={"share"} size="30px" />
      </div>

      <div ref={divRef} className="mt-10">
        {showCommentForm ? <CommentForm postId={post.post_id} /> : null}
      </div>
    </div>
  );
}
