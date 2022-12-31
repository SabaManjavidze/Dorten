import { useAutoAnimate } from "@formkit/auto-animate/react";
import { comment, user } from "@prisma/client";
import CommentForm from "../../CommentForm/CommentForm";
import CommentCard from "./CommentCard";

type CommentSectionPropType = {
  comments: (comment & {
    creator: user;
    replies: comment[];
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
      <ul ref={listRef} className="flex flex-col items-center xl:w-2/3">
        {comments?.map((comment) => (
          <li
            key={comment.comment_id}
            className="w-full py-5 first-of-type:border-t-0"
          >
            <CommentCard comment={comment as any} />
            {comment.replies?.map((reply) => (
              <li
                key={reply.comment_id}
                className="min-h-64 mr-16 mt-5 ml-48 first-of-type:border-t-0"
              >
                <CommentCard comment={reply as any} />
              </li>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
