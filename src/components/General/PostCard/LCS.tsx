import {
  GiSharpSmile as LikeIcon,
  GiSharpAxe as DislikeIcon,
} from "react-icons/gi";
import { FaSlideshare as ShareIcon } from "react-icons/fa";
import { AiOutlineComment as CommentIcon } from "react-icons/ai";
import IconButton from "./IconBtn";
import { useMemo, useState } from "react";
import CommentForm from "../CommentForm/CommentForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { trpc } from "../../../utils/trpc";
import { RouterOutputs } from "../../../server/routers/_app";
import SharePostModal from "./sharePostModal";

export default function LCS({
  post,
}: {
  post: RouterOutputs["post"]["getPosts"][number];
}) {
  const { data: userData } = trpc.user.me.useQuery();
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  const utils = trpc.useContext();

  const { mutateAsync: likePost, isLoading: loading } =
    trpc.post.likePost.useMutation({
      onSuccess() {
        utils.post.getPosts.invalidate();
      },
    });

  const likePostHandler = async (value: -1 | 1) => {
    if (!userData) return;
    await likePost({
      postId: post.post_id,
      value,
    });
  };

  const isMyPost = useMemo(
    () => post.creator.user_id == userData?.user_id,
    [post, userData]
  );
  const postLink = useMemo(
    () => `${process.env.CURRENT_URL}/post/${post.post_id}`,
    [post]
  );
  const handleCommentClick = () => {
    setShowCommentForm(!showCommentForm);
  };
  const handleShowShareModal = () => {
    setShowShareModal(!showShareModal);
  };

  return (
    <div className="flex w-4/5 flex-col">
      <SharePostModal
        postLink={postLink}
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
          <IconButton
            onClick={() => likePostHandler(1)}
            hoverColor="green"
            disabled={isMyPost || loading}
            fill={
              post?.like.length > 0 && post?.like[0].value > 0
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
              post.like.length > 0 && post.like[0].value < 0
                ? "text-skin-dislike"
                : undefined
            }
            Icon={DislikeIcon}
            size="30px"
          />
        </div>
        <IconButton
          onClick={handleCommentClick}
          Icon={CommentIcon}
          text={post?._count.comments}
          size="30px"
        />
        <IconButton
          onClick={handleShowShareModal}
          Icon={ShareIcon}
          text={"share"}
          size="30px"
        />
      </div>

      <div ref={divRef} className="mt-10">
        {showCommentForm ? <CommentForm postId={post.post_id} /> : null}
      </div>
    </div>
  );
}
