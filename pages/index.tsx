import type { NextPage } from "next";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => {
          router.push("/login");
        }}
      >
        <p>Hello World</p>
      </button>
    </div>
  );
};

export default Home;
