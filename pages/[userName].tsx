import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  GetMyProfileDocument,
  GetMyProfileQuery,
  GetPostsDocument,
  GetUserByUsernameDocument,
  GetUserByUsernameQuery,
  MeDocument,
  MeQuery,
  useGetUserByUsernameQuery,
  useMeQuery,
  UserFragmentFragment,
} from "../graphql/generated";
import { addApolloState, initializeApollo } from "../lib/apollo/ApolloClient";
import { NOT_FOUND_IMG } from "../lib/variables";

type ProfilePagePropType = {
  publicProfile: GetUserByUsernameQuery["getUserByUsername"];
  myProfile: GetMyProfileQuery["me"];
  isMyProfile: boolean;
};
const ProfilePage = ({
  myProfile,
  publicProfile,
  isMyProfile,
}: ProfilePagePropType) => {
  const router = useRouter();
  const userName = router.query.userName;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="mt-36 w-full md:px-32 lg:px-48">
        {/* User's Profile */}
        <section className="flex w-full items-center justify-between">
          {/* Profile Picture and Username */}
          <div className="flex h-72 w-64 flex-col items-center ">
            <h2 className="text-2xl">{userName}</h2>
            <div className="relative mt-3 h-full w-full">
              <Image
                src={publicProfile?.picture || NOT_FOUND_IMG}
                layout="fill"
                className="rounded-full"
		alt="Users profile picture"
              />
            </div>
          </div>
          {/* Email, EmailVerification, New Password, Stats */}
          <div className="flex flex-col">
            {isMyProfile ? (
              <h3>
                {myProfile?.user?.email_verified
                  ? "Email Verified ✔️"
                  : "Email Not Verified 💔"}
              </h3>
            ) : null}
            <h3>Number of posts: 328</h3>
            <h3>Number of likes: 1223</h3>
            <h3>Number of comments: 32</h3>
          </div>
        </section>
        {/* User's Posts */}
        <section className="mt-48">
          <label className="text-2xl">{userName}'s Posts</label>
        </section>
      </div>{" "}
    </div>
  );
};
export default ProfilePage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = initializeApollo(null, context.req.cookies);
  const { data: meData } = await apolloClient.query({
    query: MeDocument,
    variables: {
      username: context.query?.userName + "",
    },
  });
  const data = meData as MeQuery;
  const isMyProfile = data.me?.user?.username == context.query.userName;
  console.log({ meData: meData.me.user });

  const { data: userData } = await apolloClient.query({
    query: isMyProfile ? GetMyProfileDocument : GetUserByUsernameDocument,
    variables: {
      username: context.query?.userName + "",
    },
  });
  console.log("THE ACTUAL PROFILE: ", { userData });
  let myProfile: GetMyProfileQuery["me"] = null;
  let publicProfile: GetUserByUsernameQuery["getUserByUsername"];
  if (isMyProfile) {
    myProfile = (userData as GetMyProfileQuery).me;
    publicProfile = {
      user_id: myProfile?.user?.user_id + "",
      age: myProfile?.user?.age,
      gender: myProfile?.user?.gender,
      picture: myProfile?.user?.picture,
      posts: myProfile?.user?.posts,
    };
  } else {
    publicProfile = userData;
  }
  return addApolloState(apolloClient, {
    props: { myProfile, publicProfile, isMyProfile } as ProfilePagePropType,
  });
}
