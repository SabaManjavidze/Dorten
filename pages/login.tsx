import * as React from "react";
import { Copyright } from "../components/Copyright";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <div className="dark:bg-background">
      <div>
        <p>Log in</p>
        <form onSubmit={handleSubmit}>
          <input required name="email" autoComplete="email" autoFocus />
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <button type="submit">
            <p>Log In</p>
          </button>
          <div>
            <div>
              <a href="#">Forgot password?</a>
            </div>
            <div>
              <a
                href="register"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("register");
                }}
              >
                {"Don't have an account? Register"}
              </a>
            </div>
          </div>
        </form>
      </div>
      <Copyright className="absolute bottom-4" />
    </div>
  );
};
export default Login;
