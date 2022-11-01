import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  GetPostsDocument,
  GetUserByUsernameDocument,
  useGetUserByUsernameQuery,
  useMeQuery,
} from "../graphql/generated";
import { addApolloState, initializeApollo } from "../lib/apollo/ApolloClient";

const ProfilePage = () => {
  const router = useRouter();
  const { data: userData, loading: userLoading } = useMeQuery();
  const [isPublic, setIsPublic] = useState(true);
  const {
    loading,
    error,
    data: publicUser,
  } = useGetUserByUsernameQuery({
    variables: { username: router?.query?.userName + "" },
  });

  return (
    <div className="max-w-7xl px-6 md:px-7 lg:px-8">
      <h3>
        {loading ? null : publicUser?.getUserByUsername?.email}
        {/* {!userLoading
          ? publicUser?.getUserByUsername?.user_id ==
            userData?.me?.user?.user_id
            ? publicUser?.getUserByUsername?.email
            : router.query.userName
          : null} */}
      </h3>
    </div>
  );
};
export default ProfilePage;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetUserByUsernameDocument,
    variables: {
      username: context.query?.userName + "",
    },
  });

  return addApolloState(apolloClient, {
    props: {},
  });
}
