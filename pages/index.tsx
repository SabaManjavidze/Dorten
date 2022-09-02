import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import PostForm from "../components/HomePage/PostForm";
import PostList from "../components/HomePage/PostList";

const Home: NextPage = () => {
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
        <PostList />
      </section>
    </div>
  );
};

export default Home;
