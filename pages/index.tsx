import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useMeQuery } from "../graphql/generated";

const Home: NextPage = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();
  if (loading) return <div>loading...</div>;
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
        <p>Username : {data?.me?.username}</p>
        <p>email : {data?.me?.email}</p>
        <p>gender : {data?.me?.gender}</p>
        <p>age : {data?.me?.age}</p>
        <p>
          picture :{" "}
          {data?.me?.picture ? (
            <img src={data.me.picture} width="80px" />
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
