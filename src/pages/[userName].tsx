import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { NOT_FOUND_IMG } from "../lib/variables";
import { trpc } from "../utils/trpc";

const ProfilePage = () => {
  const router = useRouter();
  const userName = router.query.userName;
  const { mutate, data: publicProfile } =
    trpc.user.getUserByUsername.useMutation();
  const { data: myProfile } = trpc.user.me.useQuery();
  const isMyProfile = useMemo(
    () => publicProfile?.user_id === myProfile?.user_id,
    [publicProfile, myProfile]
  );
  useEffect(() => {
    mutate({ username: userName + "" });
  }, []);

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
            {/* {isMyProfile ? (
              <h3>
                {myProfile?.email_verified
                  ? "Email Verified ✔️"
                  : "Email Not Verified 💔"}
              </h3>
            ) : null} */}
            <h3>Number of posts: 328</h3>
            <h3>Number of likes: 1223</h3>
            <h3>Number of comments: 32</h3>
          </div>
        </section>
        {/* User's Posts */}
        <section className="mt-48">
          <label className="text-2xl">{userName}'s Posts</label>
        </section>
      </div>
    </div>
  );
};
export default ProfilePage;
