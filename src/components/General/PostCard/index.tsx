import Image from "next/image";
import React, { useState } from "react";
import { FaEdit as EditIcon } from "react-icons/fa";
import { AiFillCloseCircle as ExitIcon } from "react-icons/ai";
import LCS from "./LCS";
import Link from "next/link";
import { post, user } from "@prisma/client";
import { trpc } from "../../../utils/trpc";
import { NOT_FOUND_IMG } from "../../../lib/variables";

var wrapURLs = function (text: string, new_window: boolean = false) {
  var url_pattern =
    /(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}\-\x{ffff}0-9]+-?)*[a-z\x{00a1}\-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}\-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/gi;
  var target = new_window ? "_blank" : "";

  return text.replace(url_pattern, function (url) {
    var protocol_pattern = /^(?:(?:https?|ftp):\/\/)/i;
    var href = protocol_pattern.test(url) ? url : "http://" + url;
    return (
      '<a href="' +
      href +
      '" target="' +
      target +
      '  " class="text-blue-400 hover:text-blue-300 duration-150">' +
      url +
      "</a>"
    );
  });
};
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
              {post?.creator?.picture && (
                <Link href={`/${post.creator.username}`} className="pointer">
                  <Image
                    className="rounded-full object-cover shadow"
                    src={post?.creator?.picture || NOT_FOUND_IMG}
                    alt="avatar"
                    width="40px"
                    height="40px"
                  />
                </Link>
              )}
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
            <p
              className="mt-3 pb-5 text-sm text-gray-200"
              dangerouslySetInnerHTML={{
                __html: wrapURLs(post.description),
              }}
            ></p>
          ) : null}
          {post?.picture && post.picture.startsWith("http") ? (
            <div className="relative flex h-96 w-[85%] justify-center bg-skin-main/50 pb-12">
              <Image
                className="w-full rounded object-contain shadow"
                src={post.picture}
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
