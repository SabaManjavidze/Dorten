import { useAutoAnimate } from "@formkit/auto-animate/react";
import { comment, like, post, user, user_gender_enum } from "@prisma/client";
import { useState } from "react";
import CommentForm from "../../CommentForm/CommentForm";
import CommentCard from "./CommentCard";
import RepliesList from "./RepliesList";
import CommentSectionProvider from "./useCommentSection";
import { RouterOutputs } from "../../../../server/routers/_app";

type CommentSectionPropType = {
  comments: NonNullable<RouterOutputs["post"]["getPost"]>["comments"];
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
      <ul ref={listRef} className="flex w-4/5 flex-col items-center xl:w-full">
        {comments?.map((comment) => (
          <CommentSectionProvider key={comment.comment_id} comment={comment}>
            <li className="flex w-full flex-col py-5 first-of-type:border-t-0">
              <CommentCard />
              {comment?._count.replies ? <RepliesList /> : null}
            </li>
          </CommentSectionProvider>
        ))}
      </ul>
    </div>
  );
}
