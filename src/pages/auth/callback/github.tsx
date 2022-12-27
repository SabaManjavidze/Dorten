import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { trpc } from "../../../utils/trpc";

const Callback: NextPage = () => {
  const router = useRouter();
  const { mutateAsync: githubLogin, isLoading: loading } =
    trpc.user.githubLogin.useMutation();
  const { isFetching: meLoading, error: meError } = trpc.user.me.useQuery();
  const handleCallback = async () => {
    if (router) {
      const { query } = router;
      if (query.code) {
        const success = await githubLogin({
          code: query.code + "",
        });
        if (success) {
          router.push("/");
        }
      }
    }
    /*
   make a request to my backend 
   and in the backend read authorization code
   then get the token and get the user with token
   then authenticate user and send back cookies 
    
    */
  };
  useEffect(() => {
    handleCallback();
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <ClipLoader
        className="border-primary border-b-transparent"
        speedMultiplier={0.5}
        size={70}
        color={""}
      />
    </div>
  );
};
export default Callback;
