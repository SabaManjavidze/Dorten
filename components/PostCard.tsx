import Image from "next/image";
import React from "react";
import { Post } from "../graphql/generated";
import { NOT_FOUND_IMG } from "../lib/variables";

export default function PostCard({ post }: { post: Post }) {
  return (
    <div
      className="mx-4 flex rounded-lg bg-white
    shadow-lg dark:bg-secondary md:mx-auto "
    >
      <div className="flex items-start px-4 py-6">
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                className="rounded-full object-cover shadow"
                src={post.creator.picture || NOT_FOUND_IMG}
                alt="avatar"
                width="40px"
                height="40px"
              />
              <h2 className="ml-4 text-lg font-semibold text-gray-900 dark:text-gray-200">
                {post.creator.username}
              </h2>
            </div>
            <small className="text-sm text-gray-700 dark:text-gray-500">
              {new Date(parseInt(post.created_at)).getHours()}:
              {new Date(parseInt(post.created_at)).getMinutes()}
            </small>
          </div>
          <p className="text-gray-700 dark:text-gray-200">{post.title}</p>
          <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">
            {post.description}
          </p>
          <div className="w-full">
            <Image
              //   className="mr-4 rounded-full object-cover shadow"
              src={post.picture || NOT_FOUND_IMG}
              alt="avatar"
              width="100%"
              height="100px"
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
