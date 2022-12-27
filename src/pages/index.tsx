import type { NextPage } from "next";
import { useState } from "react";
import PostForm from "../components/HomePage/PostForm";
import PostList from "../components/HomePage/PostList";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [dragging, setDragging] = useState(false);
  const handleDragOver = () => {
    setDragging(true);
  };
  const handleDragExit = () => {
    setDragging(false);
  };
  const { isSuccess } = trpc.user.me.useQuery();

  return (
    <div
      onDragOver={handleDragOver}
      onDragExit={handleDragExit}
      className="w-full p-5 md:px-28 lg:px-52 xl:px-80"
    >
      {isSuccess ? (
        <PostForm dragging={dragging} setDragging={setDragging} />
      ) : null}
      <section>
        <div className="p-2 pb-10">
          <h2 className="text-3xl text-gray-100">Recent Posts</h2>
        </div>
        <div
          className="absolute right-1/2 h-[2px] w-3/4 
        translate-x-1/2 rounded bg-primary"
        ></div>
        <PostList />
      </section>
    </div>
  );
};

export default Home;
