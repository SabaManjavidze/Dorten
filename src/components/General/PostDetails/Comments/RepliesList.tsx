import { useAutoAnimate } from "@formkit/auto-animate/react";
import { comment, user } from "@prisma/client";
import React from "react";
import CommentCard from "./CommentCard";
import CommentSectionProvider, { useCommentSection } from "./useCommentSection";

// type RepliesListPropType = {
//   replies: (comment & { creator: user })[];
// };
function RepliesList() {
  const [ulRef] = useAutoAnimate<HTMLUListElement>();
  const { replies } = useCommentSection();
  return (
    <ul ref={ulRef}>
      {replies?.map((reply, i) => (
        <li key={reply.comment_id} className="flex h-64 w-full pl-[1px]">
          <div className="relative flex w-48 flex-col">
            {/* Horizontal branch */}
            <div className="absolute top-1/2 left-1/2 h-0.5 w-1/2 translate-y-1/2 bg-white"></div>
            {/* Vertical branch */}
            <div
              className={`absolute left-1/2 ${
                replies && i < replies.length - 1 ? "h-full" : "h-[51%]"
              } w-0.5 bg-white`}
            ></div>
          </div>
          <div className="mt-5 w-full pr-16 first-of-type:border-t-0">
            <CommentSectionProvider comment={reply}>
              <CommentCard />
            </CommentSectionProvider>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default RepliesList;
