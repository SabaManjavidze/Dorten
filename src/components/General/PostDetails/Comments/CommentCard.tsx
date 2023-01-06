import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";
import { BiTrash as TrashIcon } from "react-icons/bi";
import { FaEdit as EditIcon } from "react-icons/fa";
import { NOT_FOUND_IMG } from "../../../../lib/variables";
import { trpc } from "../../../../utils/trpc";
import CommentCardFooter from "./CommentCardFooter";
import { ScrollToType } from "./CommentSection";
import { useCommentSection } from "./useCommentSection";

type CommentCardPropType = {
  level: number;
  scrollTo: ScrollToType;
  setScrollTo: Dispatch<ScrollToType>;
};
function CommentCard({ scrollTo }: CommentCardPropType) {
  const { data: userData } = trpc.user.me.useQuery();
  const [editMode, setEditMode] = useState(false);
  const { comment } = useCommentSection();
  const cardRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useContext();
  const { mutateAsync: deleteComment } = trpc.comment.deleteComment.useMutation(
    {
      onSuccess() {
        if (!comment?.main_comment_id) {
          utils.post.getPost.invalidate({ post_id: comment?.post_id + "" });
        } else {
          utils.comment.getReplies.fetch({
            main_comment_id: comment?.main_comment_id + "",
          });
        }
      },
    }
  );
  useEffect(() => {
    if (scrollTo.to === comment?.comment_id && cardRef?.current) {
      const y =
        cardRef?.current?.getBoundingClientRect().top +
        window.pageYOffset +
        -40;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, [scrollTo]);

  const handleDeleteComment = async () => {
    await deleteComment({
      comment_id: comment?.comment_id + "",
    });
  };
  return (
    <div
      id={comment?.comment_id}
      className={`relative flex w-full flex-col duration-500`}
      ref={cardRef}
    >
      <div
        className={`flex w-full rounded-lg duration-1000 ${
          scrollTo.to === comment?.comment_id && "animate-scale"
        }
    bg-skin-comment-card shadow-lg`}
      >
        <div className="flex w-full items-start px-4 py-6">
          <div className="justiy-center flex w-full flex-col items-center">
            {/* Comment Header */}
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={`/${comment?.creator.username}`}
                  className="pointer"
                >
                  <a href={`/${comment?.creator.username}`}>
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
                  {comment?.created_at.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
              {userData && userData.user_id == comment?.creator_id ? (
                <div>
                  <button
                    className={"mr-6 text-light-primary"}
                    onClick={handleDeleteComment}
                  >
                    <TrashIcon size={"30px"} />
                  </button>
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
              <textarea
                className="border-background/50 rounded-md border-2 bg-gray-700/40 py-2 pl-3"
                defaultValue={comment?.text}
              />
            ) : (
              <div className="block w-48 break-words sm:w-60 md:w-72 lg:w-80">
                <p className="sm:text-md mt-4 py-3 text-left text-lg  text-gray-200">
                  {comment?.text}
                </p>
              </div>
            )}
            <CommentCardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
