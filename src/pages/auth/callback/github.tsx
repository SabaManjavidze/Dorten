import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import {
  useGithubLoginMutation,
  useMeLazyQuery,
} from "../../../graphql/generated";

const Callback: NextPage = () => {
  const router = useRouter();
  const [githubLogin, { loading }] = useGithubLoginMutation();
  const [meQuery, { loading: meLoading, error: meError }] = useMeLazyQuery();
  const handleCallback = async () => {
    if (router) {
      const { query } = router;
      if (query.code) {
        const { errors } = await githubLogin({
          variables: {
            code: query.code + "",
          },
        });
        if (!errors) {
          await meQuery();
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
