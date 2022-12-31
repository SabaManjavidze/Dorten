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
            <ul>
              {comment.replies?.map((reply, i) => (
                <li
                  key={reply.comment_id}
                  className="flex h-64 w-full pl-[1px]"
                >
                  <div className="relative flex w-48 flex-col">
                    {/* Horizontal branch */}
                    <div className="absolute top-1/2 h-0.5 w-full translate-y-1/2 bg-white"></div>
                    {/* Vertical branch */}
                    <div
                      className={`absolute left-0 ${
                        i < comment.replies.length - 1 ? "h-full" : "h-[51%]"
                      } w-0.5 bg-white`}
                    ></div>
                  </div>
                  <div className="mt-5 h-full w-full pr-16 first-of-type:border-t-0">
                    <CommentCard comment={reply as any} />
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
