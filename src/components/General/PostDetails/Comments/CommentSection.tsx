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

export type ScrollToType = { from: string; to: string };
export default function CommentSection({
  comments,
  postId,
}: CommentSectionPropType) {
  const [listRef] = useAutoAnimate<HTMLUListElement>();
  const [scrollTo, setScrollTo] = useState<ScrollToType>({ from: "", to: "" });

  return (
    <div className="flex flex-col items-center justify-center">
      <CommentForm postId={postId} />
      <ul
        ref={listRef}
        className="flex w-4/5 flex-col items-center lg:w-5/6 xl:w-1/2"
      >
        {comments?.map((comment) => (
          <CommentSectionProvider key={comment.comment_id} comment={comment}>
            <li className="flex w-full flex-col py-5 first-of-type:border-t-0">
              <CommentCard
                level={0}
                scrollTo={scrollTo}
                setScrollTo={setScrollTo}
              />
              {comment?._count.replies ? (
                <RepliesList
                  level={1}
                  scrollTo={scrollTo}
                  setScrollTo={setScrollTo}
                />
              ) : null}
            </li>
          </CommentSectionProvider>
        ))}
      </ul>
    </div>
  );
}
