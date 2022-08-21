import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMeQuery } from "../graphql/generated";
import { useAuth } from "../Hooks/useAuth";

const Home: NextPage = () => {
  const router = useRouter();
  const { user, loading, errors } = useAuth();
  if (errors) {
    console.log(errors);
    return <p>{errors.message}</p>;
  }
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <button
        onClick={() => {
          router.push("/login");
        }}
        className="rounded bg-blue-600 px-7 py-3 font-medium text-white"
      >
        Login
      </button>
      <div className="text-left">
        <p>Username : {user.username}</p>
        <p>email : {user.email}</p>
        <p>gender : {user.gender}</p>
        <p>age : {user.age}</p>
        <p>
          picture :{" "}
          {user.picture ? (
            <img src={user.picture} width="80px" />
          ) : (
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
              width="80px"
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default Home;
