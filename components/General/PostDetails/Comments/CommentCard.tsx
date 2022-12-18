import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";
import { FaEdit as EditIcon } from "react-icons/fa";
import { Comment, useMeQuery } from "../../../../graphql/generated";
import { NOT_FOUND_IMG } from "../../../../lib/variables";

type CommentCardPropType = {
  comment: Comment;
};
function CommentCard({ comment }: CommentCardPropType) {
  const { loading: userLoading, data: userData } = useMeQuery();
  const [editMode, setEditMode] = useState(false);
  return (
    <div
      className="flex w-full rounded-lg
    bg-skin-comment-card shadow-lg"
    >
      <div className="flex w-full items-start px-4 py-6">
        <div className="justiy-center flex w-full flex-col items-center">
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
                {new Date(parseInt(comment?.created_at)).toLocaleTimeString(
                  "en-GB",
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </small>
            </div>
            {userData?.me?.user &&
            userData?.me?.user.user_id == comment?.creator_id ? (
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
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
