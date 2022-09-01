import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { Post, useGetPostsQuery } from "../graphql/generated";
import PostForm from "../components/HomePage/PostForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const Home: NextPage = () => {
  const router = useRouter();
  const {
    loading: postsLoading,
    data: postsData,
    error: postsError,
  } = useGetPostsQuery({ variables: { post_id: "" } });
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <div className="w-full p-5 xl:px-96">
      <PostForm />
      <section>
        <div className="p-2 pb-10">
          <h2 className="text-3xl text-gray-100">Recent Posts</h2>
        </div>
        <div
          className="absolute right-1/2 h-[2px] w-3/4 
        translate-x-1/2 rounded bg-pink-500"
        ></div>
        <ul ref={listRef} className="flex flex-col items-center">
          {!postsLoading ? (
            postsError ? (
              <span>Something went wrong</span>
            ) : postsLoading ? null : (
              postsData?.getPost?.map((post) => (
                <li
                  key={post.post_id}
                  className="w-4/5 py-5 first-of-type:border-t-0 "
                >
                  <PostCard post={post as Post} />
                </li>
              ))
            )
          ) : (
            <div className="mt-20">
              <h3>Loading...</h3>
            </div>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Home;
