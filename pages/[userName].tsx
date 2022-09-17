import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useGetUserByUsernameLazyQuery,
  useMeQuery,
} from "../graphql/generated";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const { data: userData, loading: userLoading } = useMeQuery();
  const [isPublic, setIsPublic] = useState(true);
  const [getUser, { loading, error, data }] = useGetUserByUsernameLazyQuery();
  useEffect(() => {
    if (router.query.userName) {
      getUser({
        variables: { username: router.query.userName.toString() },
      });
    }
  }, [router]);

  useEffect(() => {
    if (
      !loading &&
      data?.getUserByUsername &&
      !userLoading &&
      userData?.me?.user
    )
      setIsPublic(
        userData?.me?.user.user_id !== data.getUserByUsername.user_id
      );
    // show email and editable fields
    // else it is someone else's profile so show public info
  }, [loading, data, userLoading]);

  if (loading) return <h3>loading...</h3>;
  return (
    <div className="max-w-7xl px-6 md:px-7 lg:px-8">
      <h3>{data?.getUserByUsername?.email}</h3>
    </div>
  );
};
export default ProfilePage;
