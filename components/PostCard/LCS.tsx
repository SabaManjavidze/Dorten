import {
  GiSharpSmile as LikeIcon,
  GiSharpAxe as DislikeIcon,
} from "react-icons/gi";
import { FaSlideshare as ShareIcon } from "react-icons/fa";
import { AiOutlineComment as CommentIcon } from "react-icons/ai";
import { Post, useLikePostMutation } from "../../graphql/generated";
import IconButton from "./IconButton";

export default function LCS({ post }: { post: Post }) {
  const [likePost] = useLikePostMutation();
  const likePostHandler = async (value: -1 | 1) => {
    likePost({
      variables: {
        postId: post.post_id,
        value,
      },
    });
  };
  return (
    <div className="mt-4 flex w-4/5 items-center justify-between">
      <div className="flex items-center justify-between">
        <IconButton
          onClick={() => likePostHandler(1)}
          hoverColor="green"
          fill={
            post.likeStatus
              ? post.likeStatus > 0
                ? "green"
                : undefined
              : undefined
          }
          Icon={LikeIcon}
          size="30px"
        />
        <h3 className="m-0 p-0 text-left text-pink-200">{post.points || 0}</h3>
        <IconButton
          onClick={() => likePostHandler(-1)}
          hoverColor="pink"
          fill={
            post.likeStatus
              ? post.likeStatus > 0
                ? undefined
                : "red"
              : undefined
          }
          Icon={DislikeIcon}
          size="30px"
        />
      </div>
      <IconButton Icon={CommentIcon} text={8} size="30px" />
      <IconButton Icon={ShareIcon} text={"share"} size="30px" />
    </div>
  );
}
