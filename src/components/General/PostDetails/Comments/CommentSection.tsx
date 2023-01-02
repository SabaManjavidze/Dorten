import { useAutoAnimate } from "@formkit/auto-animate/react";
import { comment, user } from "@prisma/client";
import { useState } from "react";
import { trpc } from "../../../../utils/trpc";
import CommentForm from "../../CommentForm/CommentForm";
import CommentCard from "./CommentCard";

type CommentSectionPropType = {
  comments: (comment & {
    creator: user;
  })[];
  postId: string;
};

export default function CommentSection({
  comments,
  postId,
}: CommentSectionPropType) {
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <div className="flex flex-col items-center justify-center">
      <CommentForm postId={postId} />
      <ul
        ref={listRef}
        className="flex flex-col items-center md:w-2/3 xl:w-full"
      >
        {comments?.map((comment) => (
          <li
            key={comment.comment_id}
            className="w-full py-5 first-of-type:border-t-0"
          >
            <CommentCard comment={comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
