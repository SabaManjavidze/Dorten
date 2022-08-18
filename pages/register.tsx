import * as React from "react";
import { Copyright } from "../components/Copyright";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Register: NextPage = () => {
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
    <div>
      <div>
        <p>Register</p>
        <form onSubmit={handleSubmit}>
          <div>
            <input required name="username" autoComplete="username" autoFocus />
            <input required type="number" name="age" autoComplete="age" />
          </div>
          <input required id="email" name="email" autoComplete="email" />
          <input
            required
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <button type="submit">
            <p>Register</p>
          </button>
          <div>
            <div>
              <a href="#">Forgot password?</a>
            </div>
            <div>
              <a
                href="login"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("login");
                }}
              >
                {"Already have an account? Log In"}
              </a>
            </div>
          </div>
        </form>
      </div>
      <Copyright sx={{ position: "absolute", bottom: "20px" }} />
    </div>
  );
};
export default Register;
