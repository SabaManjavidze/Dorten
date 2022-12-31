import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import CommentSection from "../../components/General/PostDetails/Comments/CommentSection";
import { NOT_FOUND_IMG } from "../../../lib/variables";
import { trpc } from "../../utils/trpc";
import Head from "next/head";

function PostDetailsPage() {
  const router = useRouter();
  const { data: postData } = trpc.post.getPost.useQuery({
    post_id: router.query.postId + "",
  });
  return (
    <div className="pb-52 pt-20">
      <Head>
        <title>Social Media Preview</title>
        <meta property="og:url" content="your url" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="your fb id" />
        <meta property="og:title" content={postData?.title + ""} />
        <meta name="twitter:card" content="summary" />
        <meta property="og:description" content={postData?.description + ""} />
        <meta property="og:image" content={postData?.picture + ""} />
      </Head>
      <h1 className="text-center text-2xl">{postData?.title}</h1>
      <div className="relative mt-5 flex h-[500px] w-full justify-center bg-skin-main/50 pb-12">
        <Image
          className="w-full rounded object-contain shadow"
          src={postData?.picture || NOT_FOUND_IMG}
          alt="avatar"
          objectFit="contain"
          layout="fill"
        />
      </div>
      <section className="mt-14 px-32">
        <label htmlFor="comments" className="ml-20 text-2xl">
          Comments
        </label>
        <CommentSection
          comments={postData?.comments as any}
          postId={router.query.postId + ""}
        />
      </section>
    </div>
  );
}

export default PostDetailsPage;
