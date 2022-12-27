import { useAutoAnimate } from "@formkit/auto-animate/react";
import { post } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import PostCard from "../General/PostCard";

export default function PostList() {
  const {
    isFetching: postsLoading,
    data: postsData,
    error: postsError,
  } = trpc.post.getPosts.useQuery();
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <div>
      <ul ref={listRef} className="flex flex-col items-center">
        {postsData?.map((childPost) => (
          <li
            key={childPost.post_id}
            className="w-full py-5 first-of-type:border-t-0 xl:w-2/3"
          >
            <PostCard post={childPost as any} />
          </li>
        ))}
      </ul>
    </div>
  );
}
