import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
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

  if (meLoading) return <h3>Loading...</h3>;
  if (meError) return <h3>There was an error</h3>;

  return <div>hello this is callback</div>;
};
export default Callback;
