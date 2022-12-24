import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import CommentSection from "../../components/General/PostDetails/Comments/CommentSection";
import {
  Comment,
  GetPostDocument,
  GetPostQueryVariables,
  useGetPostQuery,
} from "../../graphql/generated";
import {
  addApolloState,
  initializeApollo,
} from "../../lib/apollo/ApolloClient";
import { NOT_FOUND_IMG } from "../../lib/variables";

function PostDetailsPage() {
  const router = useRouter();
  const { data: postData } = useGetPostQuery({
    variables: {
      post_id: router.query.postId + "",
    },
  });
  return (
    <div className="mt-20">
      <h1 className="text-center text-2xl">{postData?.getPost[0].title}</h1>
      <div className="relative mt-5 flex h-[500px] w-full justify-center bg-skin-main/50 pb-12">
        <Image
          className="w-full rounded object-contain shadow"
          src={postData?.getPost[0].picture || NOT_FOUND_IMG}
          alt="avatar"
          objectFit="contain"
          layout="fill"
        />
      </div>
      <section className="mt-14 ">
        <label htmlFor="comments" className="ml-20 text-2xl">
          Comments
        </label>
        <CommentSection
          comments={postData?.getPost[0].comments as Comment[]}
          postId={router.query.postId + ""}
        />
      </section>
    </div>
  );
}

export default PostDetailsPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = initializeApollo(null, context.req.cookies);
  const post_id = context.query.postId;
  if (!post_id)
    return {
      props: {},
    };
  await apolloClient.query({
    query: GetPostDocument,
    variables: {
      post_id,
    } as GetPostQueryVariables,
  });
  return addApolloState(apolloClient, {
    props: {},
  });
}
