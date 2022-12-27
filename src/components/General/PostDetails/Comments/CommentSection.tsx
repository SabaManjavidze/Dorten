import { useAutoAnimate } from "@formkit/auto-animate/react";
import { comment } from "@prisma/client";
import CommentForm from "../../CommentForm/CommentForm";
import CommentCard from "./CommentCard";

type CommentSectionPropType = {
  comments: comment[];
  postId: string;
};

export default function CommentSection({
  comments,
  postId,
}: CommentSectionPropType) {
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <div>
      <CommentForm postId={postId} />
      <ul ref={listRef} className="flex flex-col items-center">
        {comments?.map((comment) => (
          <li
            key={comment.comment_id}
            className="w-full py-5 first-of-type:border-t-0 xl:w-2/3"
          >
            <CommentCard comment={comment as any} />
          </li>
        ))}
      </ul>
    </div>
  );
}
