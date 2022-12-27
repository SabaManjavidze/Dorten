import {
  GiSharpSmile as LikeIcon,
  GiSharpAxe as DislikeIcon,
} from "react-icons/gi";
import { FaSlideshare as ShareIcon } from "react-icons/fa";
import { AiOutlineComment as CommentIcon } from "react-icons/ai";
import IconButton from "./IconBtn";
import { useState } from "react";
import CommentForm from "../CommentForm/CommentForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { trpc } from "../../../utils/trpc";
import { comment, like, post, user } from "@prisma/client";

let likeValue = 0;
export default function LCS({
  post,
}: {
  post: post & { creator: user; comments: comment[]; like: like };
}) {
  const { data: userData } = trpc.user.me.useQuery();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  const { mutateAsync: likePost, isLoading: loading } =
    trpc.post.likePost.useMutation();
  const likePostHandler = async (value: -1 | 1) => {
    if (!userData) return;
    likeValue = value;
    await likePost({
      postId: post.post_id,
      value,
    });
  };
  const isMyPost = post.creator.user_id == userData?.user_id;
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
              post?.like && post?.like.value > 0 ? "text-skin-like" : undefined
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
              post.like
                ? post.like.value > 0
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
