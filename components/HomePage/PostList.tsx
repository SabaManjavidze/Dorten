import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { Post, useGetPostsQuery } from "../../graphql/generated";
import PostCard from "../PostCard";

export default function NavBar() {
  const {
    loading: postsLoading,
    data: postsData,
    error: postsError,
  } = useGetPostsQuery({ variables: { post_id: "" } });
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  if (postsLoading)
    return (
      <div className="mt-20">
        <h3>Loading...</h3>
      </div>
    );
  if (postsError)
    return (
      <div className="mt-20">
        <span>Something went wrong</span>
      </div>
    );

  return (
    <ul ref={listRef} className="flex flex-col items-center">
      {postsData?.getPost?.map((post) => (
        <li key={post.post_id} className="w-4/5 py-5 first-of-type:border-t-0 ">
          <PostCard post={post as Post} />
        </li>
      ))}
    </ul>
  );
}
