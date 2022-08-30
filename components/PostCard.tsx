import Image from "next/image";
import React, { useState } from "react";
import { Post } from "../graphql/generated";
import { useAuth } from "../Hooks/useAuth";
import { NOT_FOUND_IMG } from "../lib/variables";
import { FaEdit as EditIcon } from "react-icons/fa";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  return (
    <div
      className="flex w-full rounded-lg
    bg-white shadow-lg dark:bg-secondary md:mx-auto"
    >
      <div className="flex w-full items-start px-4 py-6">
        <div className="justiy-center flex w-full flex-col items-center">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Image
                className="rounded-full object-cover shadow"
                src={post.creator.picture || NOT_FOUND_IMG}
                alt="avatar"
                width="40px"
                height="40px"
              />
              <div className="ml-4 text-gray-900 dark:text-gray-200">
                {editMode ? (
                  <input
                    type="text"
                    className="rounded-md border-2 border-background/50 bg-gray-700/40 py-2 pl-3"
                    defaultValue={post.creator.username}
                  />
                ) : (
                  <h2 className="text-lg font-semibold ">
                    {post.creator.username}
                  </h2>
                )}
              </div>
              <small className="ml-4 text-sm text-gray-700 dark:text-gray-500">
                {new Date(parseInt(post.created_at)).getHours()}:
                {new Date(parseInt(post.created_at)).getMinutes()}
              </small>
            </div>
            {user && user.user_id == post.creator_id ? (
              <div>
                <button
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? (
                    <ExitIcon size={"30px"} />
                  ) : (
                    <EditIcon size="30px" />
                  )}
                </button>
              </div>
            ) : null}
          </div>
          <p className="mt-4 w-full text-left text-gray-700 dark:text-gray-200">
            {post.title}
          </p>
          <p className="mt-3 pb-5 text-sm text-gray-700 dark:text-gray-200">
            {post.description || "no description"}
          </p>
          <div className="relative flex h-96 w-[85%] justify-center bg-background/50 pb-12">
            <Image
              className="w-full rounded object-contain shadow"
              src={post.picture || NOT_FOUND_IMG}
              alt="avatar"
              objectFit="contain"
              layout="fill"
            />
          </div>
          <div className="mt-4 flex items-center">
            <button
              className="mr-3 flex text-sm text-gray-700 dark:text-gray-200
            "
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="mr-1 h-4 w-4 fill-secondary duration-300
                ease-in-out hover:fill-red-500 hover:stroke-transparent"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>12</span>
            </button>
            <div className="mr-8 flex text-sm text-gray-700 dark:text-gray-200">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="mr-1 h-4 w-4"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
              <span>8</span>
            </div>
            <button
              className="mr-4 flex text-sm text-gray-200 duration-200
            ease-in-out hover:text-pink-300"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                className="mr-1 h-4 w-4"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <span>share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
