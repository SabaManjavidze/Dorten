import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useLogoutMutation, useMeLazyQuery, User } from "../graphql/generated";
import { useAuth } from "../Hooks/useAuth";

const Home: NextPage = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { user, setUser } = useAuth();
  // const [user, setUser] = useState<User | null>();
  const [meQuery, { loading, data, error }] = useMeLazyQuery();

  const fetchMe = useCallback(async () => {
    if (user) return;
    const result = await meQuery();
    if (result.data?.me?.user) {
      setUser(result.data.me.user as User);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {error ? <p>{error.message}</p> : null}
      {!error && !user ? <p>Not authorized</p> : null}

      <button
        onClick={() => {
          router.push("/login");
        }}
        className="rounded bg-blue-600 px-7 py-3 font-medium text-white"
      >
        Login
      </button>
      <button
        onClick={() => {
          logout();
          setUser(null);
        }}
        className="rounded bg-red-600 px-7 py-3 font-medium text-white"
      >
        Logout
      </button>
      {!loading && user ? (
        <div className="text-left">
          <p>Username : {user.username}</p>
          <p>email : {user.email}</p>
          <p>gender : {user.gender}</p>
          <p>age : {user.age}</p>
          <p>
            picture :{" "}
            {user.picture ? (
              <Image
                src={user.picture}
                width={80}
                height={80}
                alt="User's profile picture"
              />
            ) : (
              <Image
                src={
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                }
                width={80}
                height={80}
                alt="emtpy profile"
              />
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
