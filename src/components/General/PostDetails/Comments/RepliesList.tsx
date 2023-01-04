import { useAutoAnimate } from "@formkit/auto-animate/react";
import { comment, user } from "@prisma/client";
import React, { useEffect } from "react";
import CommentCard from "./CommentCard";
import CommentSectionProvider, { useCommentSection } from "./useCommentSection";

// type RepliesListPropType = {
//   replies: (comment & { creator: user })[];
// };
function RepliesList() {
  const [ulRef] = useAutoAnimate<HTMLUListElement>();
  const { replies, showReplies } = useCommentSection();
  useEffect(() => {
    console.log({ replies, showReplies });
  }, [replies, showReplies]);

  return (
    <ul ref={ulRef} className="pl-48">
      {showReplies &&
        replies?.map((reply, i) => (
          <li
            className="min-h-64 flex w-full flex-col pl-[1px]"
            key={reply.comment_id}
          >
            <CommentSectionProvider comment={reply}>
              <div className="relative flex w-full flex-col ">
                {/* Vertical branch */}
                <div
                  className={`absolute ${
                    replies && i < replies.length - 1 ? "h-full" : "h-[55%]"
                  } w-0.5 bg-white`}
                ></div>
                <div className="mt-5 flex w-full pr-16 ">
                  <div className="relative flex w-48">
                    {/* Horizontal branch */}
                    <div className="absolute top-1/2 h-0.5 w-full translate-y-1/2 bg-white"></div>
                  </div>
                  <CommentCard />
                </div>
                <RepliesList />
              </div>
            </CommentSectionProvider>
          </li>
        ))}
    </ul>
  );
}

export default RepliesList;
