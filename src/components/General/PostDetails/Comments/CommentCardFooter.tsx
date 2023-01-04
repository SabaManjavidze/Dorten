import { useAutoAnimate } from "@formkit/auto-animate/react";
import React, { useState } from "react";
import {
  IoMdArrowDropleft as LeftArrowIcon,
  IoMdArrowDropdown as DownArrowIcon,
} from "react-icons/io";
import { MdOutlineQuickreply as ReplyIcon } from "react-icons/md";
import { trpc } from "../../../../utils/trpc";
import CommentForm from "../../CommentForm/CommentForm";
import { useCommentSection } from "./useCommentSection";

function CommentCardFooter() {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  const handleShowReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  };
  const utils = trpc.useContext();
  const { handleShowReplies, showReplies, comment, refetch } =
    useCommentSection();
  return (
    <div className="w-full ">
      <div className="flex justify-around ">
        {/* Open Reply Form Button */}
        <button type="button" className="flex" onClick={handleShowReplyForm}>
          <p className="mr-3">Reply </p>
          <ReplyIcon size="30px" className="text-light-primary" />
        </button>
        {/* Show Replies Button */}
        {comment && comment._count.replies > 0 ? (
          <button
            onClick={handleShowReplies}
            className="text-ligh-primary flex items-center"
          >
            <p className="pr-5">{showReplies ? "Hide" : "Show"} Replies</p>
            {showReplies ? (
              <DownArrowIcon className="text-primary" size={25} />
            ) : (
              <LeftArrowIcon className="text-primary" size={25} />
            )}
          </button>
        ) : null}
      </div>
      <div ref={divRef} className={"w-full pt-5"}>
        {showReplyForm && comment ? (
          <div>
            <CommentForm
              postId={comment.post_id}
              mainCommentId={comment.comment_id}
              refetch={() => {
                refetch();
                utils.comment.getReplies.fetch({
                  main_comment_id: comment?.main_comment_id + "",
                });
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CommentCardFooter;
