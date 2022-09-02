import Image from "next/image";
import React, { useState } from "react";
import { Post, useMeQuery } from "../../graphql/generated";
import { NOT_FOUND_IMG } from "../../lib/variables";
import { FaEdit as EditIcon } from "react-icons/fa";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";
import LCS from "./LCS";

export default function PostCard({ post }: { post: Post }) {
  const { loading, data, error } = useMeQuery();
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
                {new Date(parseInt(post.created_at)).toLocaleTimeString(
                  "en-GB",
                  { hour: "2-digit", minute: "2-digit" }
                )}
                {/* {new Date(parseInt(post.created_at)).getMinutes()} */}
              </small>
            </div>
            {data?.me?.user && data?.me?.user.user_id == post.creator_id ? (
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
          <LCS post={post} />
        </div>
      </div>
    </div>
  );
}
