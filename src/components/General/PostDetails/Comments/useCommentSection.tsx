import { comment, user } from "@prisma/client";
import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import { RouterOutputs } from "../../../../server/routers/_app";
import { trpc } from "../../../../utils/trpc";

type useCommentSectionPropType = {
  children: JSX.Element;
  comment: NonNullable<RouterOutputs["post"]["getPost"]>["comments"][number];
};

type ContextType = {
  showReplies: boolean;
  setShowReplies: Dispatch<boolean>;
  comment?: NonNullable<RouterOutputs["post"]["getPost"]>["comments"][number];
  replies?: RouterOutputs["comment"]["getReplies"];
  handleShowReplies: () => void;
  refetch: () => void;
};

export const CommentSectionContext = createContext<ContextType>({
  showReplies: false,
  setShowReplies: () => {},
  replies: undefined,
  handleShowReplies: () => {},
  refetch: () => {},
  comment: undefined,
});

function CommentSectionProvider({
  children,
  comment,
}: useCommentSectionPropType) {
  const [showReplies, setShowReplies] = useState(false);

  const { data: replies, refetch: refetchReplies } =
    trpc.comment.getReplies.useQuery(
      {
        main_comment_id: comment.comment_id,
      },
      { enabled: false }
    );

  const handleShowReplies = async () => {
    setShowReplies(!showReplies);
    if (!showReplies) {
      await refetchReplies();
    }
  };
  return (
    <CommentSectionContext.Provider
      value={{
        handleShowReplies,
        replies,
        showReplies,
        setShowReplies,
        comment,
        refetch: refetchReplies,
      }}
    >
      {children}
    </CommentSectionContext.Provider>
  );
}
export const useCommentSection = () => useContext(CommentSectionContext);
export default CommentSectionProvider;
