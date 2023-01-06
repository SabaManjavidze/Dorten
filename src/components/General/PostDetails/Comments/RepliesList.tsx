import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { FiExternalLink } from "react-icons/fi";
import CommentCard from "./CommentCard";
import { ScrollToType } from "./CommentSection";
import CommentSectionProvider, { useCommentSection } from "./useCommentSection";

type RepliesListPropType = {
  level: number;
  scrollTo: ScrollToType;
  setScrollTo: Dispatch<ScrollToType>;
};
function RepliesList({ level, scrollTo, setScrollTo }: RepliesListPropType) {
  const [ulRef] = useAutoAnimate<HTMLUListElement>();
  const { replies, showReplies } = useCommentSection();

  const isDeep = useMemo(() => level >= 2, [level]);

  return (
    <ul
      ref={ulRef}
      className={`${
        isDeep ? "!pl-0" : "pl-5"
      } sm:pl-16 md:pl-16 lg:w-full lg:pl-12 xl:w-full `}
    >
      {showReplies &&
        replies?.map((reply, i) => (
          <li
            className={`min-h-64 flex w-full flex-col pl-[1px] `}
            key={reply.comment_id}
          >
            <CommentSectionProvider comment={reply}>
              <div className="relative flex w-full flex-col ">
                {/* Vertical branch */}
                {i < replies.length - 1 ? (
                  <div
                    className={`${
                      isDeep ? "hidden" : "block"
                    } absolute h-full w-0.5 bg-white`}
                  ></div>
                ) : null}
                <div className="flex w-full ">
                  <div
                    className={`relative ${
                      isDeep ? "opacity-0" : "flex"
                    } w-48 flex-[1] lg:flex-[0.5]`}
                  >
                    {/* Vertical branch */}
                    {i >= replies.length - 1 ? (
                      <div className={"absolute h-[51%] w-0.5 bg-white"}></div>
                    ) : null}
                    {/* Horizontal branch */}
                    <div className="absolute top-1/2 h-0.5 w-full translate-y-1/2 bg-white"></div>
                  </div>
                  <div className="mt-5 flex w-full flex-[10] flex-col ">
                    <button
                      onClick={() =>
                        setScrollTo({
                          to: reply?.main_comment_id + "",
                          from: reply.comment_id,
                        })
                      }
                      className="ml-4 flex w-min items-center text-left text-gray-500"
                    >
                      <FiExternalLink size={15} />
                      <p className="ml-3 whitespace-nowrap">
                        Reply to {reply.main_comment?.creator.username}
                      </p>
                    </button>
                    <CommentCard
                      level={level}
                      setScrollTo={setScrollTo}
                      scrollTo={scrollTo}
                    />
                  </div>
                </div>
                <RepliesList
                  level={level + 1}
                  setScrollTo={setScrollTo}
                  scrollTo={scrollTo}
                />
              </div>
            </CommentSectionProvider>
          </li>
        ))}
    </ul>
  );
}

export default RepliesList;
