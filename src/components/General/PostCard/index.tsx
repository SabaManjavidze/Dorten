import Image from "next/image";
import React, { useState } from "react";
import { FaEdit as EditIcon } from "react-icons/fa";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";
import LCS from "./LCS";
import Link from "next/link";
import { post, user } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { NOT_FOUND_IMG } from "../../../lib/variables";

export default function PostCard({ post }: { post: post & { creator: user } }) {
  const { isFetching: userLoading, data: userData } = trpc.user.me.useQuery();
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      className="flex w-full rounded-lg
    bg-skin-post-card shadow-lg"
    >
      <div className="flex w-full items-start px-4 py-6">
        <div className="justiy-center flex w-full flex-col items-center">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Link href={`/${post.creator.username}`} className="pointer">
                <a href={`/${post.creator.username}`}>
                  <Image
                    className="rounded-full object-cover shadow"
                    src={post?.creator?.picture || NOT_FOUND_IMG}
                    alt="avatar"
                    width="40px"
                    height="40px"
                  />
                </a>
              </Link>
              <div className="ml-4 text-gray-200">
                <h2 className="text-lg font-semibold ">
                  {post?.creator?.username}
                </h2>
              </div>
              <small className="ml-4 text-sm text-gray-500">
                {new Date(post?.created_at).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
            {userData?.user_id == post?.creator_id ? (
              <div>
                <button
                  className={"text-light-primary"}
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
          <div className="mt-4 w-full py-3 ">
            {editMode ? (
              <input
                type="text"
                className="border-background/50 rounded-md border-2 bg-gray-700/40 py-2 pl-3"
                defaultValue={post.title}
              />
            ) : (
              <Link href={`/post/${post.post_id}`}>
                <a
                  href={`/post/${post.post_id}`}
                  className="text-left text-lg text-gray-200"
                >
                  {post.title}
                </a>
              </Link>
            )}
          </div>
          {post.description ? (
            <p className="mt-3 pb-5 text-sm text-gray-200">
              {post.description}
            </p>
          ) : null}
          {post?.picture ? (
            <div className="relative flex h-96 w-[85%] justify-center bg-skin-main/50 pb-12">
              <Image
                className="w-full rounded object-contain shadow"
                src={post.picture || NOT_FOUND_IMG}
                alt="avatar"
                objectFit="contain"
                layout="fill"
              />
            </div>
          ) : null}
          <LCS post={post as any} />
        </div>
      </div>
    </div>
  );
}
