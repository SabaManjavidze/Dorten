import { comment, user } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";
import { MdOutlineQuickreply as ReplyIcon } from "react-icons/md";
import { FaEdit as EditIcon } from "react-icons/fa";
import { NOT_FOUND_IMG } from "../../../../../lib/variables";
import { trpc } from "../../../../utils/trpc";
import { theme } from "../../../../../tailwind.config";
import CommentForm from "../../CommentForm/CommentForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type CommentCardPropType = {
  comment: comment & { creator: user };
};
function CommentCard({ comment }: CommentCardPropType) {
  const { isFetching: userLoading, data: userData } = trpc.user.me.useQuery();
  const [editMode, setEditMode] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  return (
    <div
      className="flex w-full rounded-lg
    bg-skin-comment-card shadow-lg"
    >
      <div className="flex w-full items-start px-4 py-6">
        <div className="justiy-center flex w-full flex-col items-center">
          {/* Comment Header */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Link href={`/${comment.creator.username}`} className="pointer">
                <a href={`/${comment.creator.username}`}>
                  <Image
                    className="rounded-full object-cover shadow"
                    src={comment?.creator?.picture || NOT_FOUND_IMG}
                    alt="avatar"
                    width="40px"
                    height="40px"
                  />
                </a>
              </Link>
              <div className="ml-4 text-gray-200">
                <h2 className="text-lg font-semibold ">
                  {comment?.creator?.username}
                </h2>
              </div>
              <small className="ml-4 text-sm text-gray-500">
                {new Date(comment?.created_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
            {userData && userData.user_id == comment?.creator_id ? (
              <div>
                <button
                  className={"text-light-primary"}
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? (
                    <ExitIcon size={"30px"} />
                  ) : (
                    <EditIcon size="30px" />
                  )}
                </button>
              </div>
            ) : null}
          </div>
          {editMode ? (
            <input
              type="text"
              className="border-background/50 rounded-md border-2 bg-gray-700/40 py-2 pl-3"
              defaultValue={comment?.text}
            />
          ) : (
            <p className="mt-4 w-full py-3 text-left text-lg text-gray-200">
              {comment.text}
            </p>
          )}
          <div className="flex justify-end ">
            <button
              type="button"
              className="flex"
              onClick={() => {
                setShowReplyForm(!showReplyForm);
              }}
            >
              <p className="mr-3">Reply </p>
              <ReplyIcon size="30px" color={theme.extend.colors.primary} />
            </button>
          </div>
          <div ref={divRef} className={"w-full pt-5"}>
            {showReplyForm ? (
              <CommentForm
                postId={comment.post_id}
                mainCommentId={comment.comment_id}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
