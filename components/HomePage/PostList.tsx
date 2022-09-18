import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Post, useGetPostsQuery } from "../../graphql/generated";
import PostCard from "../PostCard";

export default function PostList() {
  const {
    loading: postsLoading,
    data: postsData,
    error: postsError,
  } = useGetPostsQuery({ variables: { post_id: "" } });
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <div>
      <ul ref={listRef} className="flex flex-col items-center">
        {postsData?.getPost?.map((post) => (
          <li
            key={post.post_id}
            className="w-full py-5 first-of-type:border-t-0 xl:w-2/3"
          >
            <PostCard post={post as Post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
