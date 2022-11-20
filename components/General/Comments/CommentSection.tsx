import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Comment } from "../../../graphql/generated";
import CommentCard from "./CommentCard";

type CommentSectionPropType = {
  comments: Comment[];
};

export default function CommentSection({ comments }: CommentSectionPropType) {
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <div>
      <ul ref={listRef} className="flex flex-col items-center">
        {comments.map((comment) => (
          <li
            key={comment.comment_id}
            className="w-full py-5 first-of-type:border-t-0 xl:w-2/3"
          >
            <CommentCard comment={comment as Comment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
