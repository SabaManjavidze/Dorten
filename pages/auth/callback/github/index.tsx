import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGithubLoginMutation } from "../../../../graphql/generated";

const Callback: NextPage = () => {
  const router = useRouter();
  const [githubLogin, { loading }] = useGithubLoginMutation();
  useEffect(() => {
    if (router) {
      const { query } = router;
      if (query.code) {
        githubLogin({
          variables: {
            code: query.code + "",
          },
        });
      }
    }
    /*
   make a request to my backend 
   and in the backend read authorization code
   then get the token and get the user with token
   then authenticate user and send back cookies 
    
    */
  }, [router]);

  return <div>hello this is callback</div>;
};
export default Callback;
