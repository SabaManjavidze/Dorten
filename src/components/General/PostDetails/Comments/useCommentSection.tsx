import { comment, user } from "@prisma/client";
import React, {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useState,
} from "react";
import { trpc } from "../../../../utils/trpc";

type useCommentSectionPropType = {
  children: JSX.Element;
  comment: comment & {
    creator: user;
  };
};

type ContextType = {
  showReplies: boolean;
  setShowReplies: Dispatch<boolean>;
  comment?: comment & {
    creator: user;
  };
  replies?:
    | (comment & {
        creator: user;
      })[];
  handleShowReplies: () => void;
};

export const CommentSectionContext = createContext<ContextType>({
  showReplies: false,
  setShowReplies: () => {},
  replies: undefined,
  handleShowReplies: () => {},
  comment: undefined,
});

function CommentSectionProvider({
  children,
  comment,
}: useCommentSectionPropType) {
  const [showReplies, setShowReplies] = useState(false);

  const { data: replies, refetch } = trpc.comment.getReplies.useQuery(
    {
      main_comment_id: comment.comment_id,
    },
    { enabled: false }
  );

  const handleShowReplies = async () => {
    setShowReplies(!showReplies);
    if (!showReplies) {
      await refetch();
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
      }}
    >
      {children}
    </CommentSectionContext.Provider>
  );
}
export const useCommentSection = () => useContext(CommentSectionContext);
export default CommentSectionProvider;
