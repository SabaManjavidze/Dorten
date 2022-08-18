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
    <section className="h-screen">
      <div className="h-full px-6">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between xl:justify-center">
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:ml-20 xl:w-5/12">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row items-center justify-center lg:justify-start">
                <p className="mb-0 mr-4 text-3xl">Sign in with</p>
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="mx-1 inline-block rounded-full bg-black p-3 text-xs font-medium leading-tight shadow-md transition duration-300 ease-in-out hover:bg-gray-800 hover:shadow-lg "
                >
                  {/* Github Logo */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className="mx-1 inline-block rounded-full bg-blue-800 p-3 text-xs font-medium leading-tight shadow-md transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg "
                >
                  {/* Google Logo */}
                  <img
                    src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                    className="h-4 w-4 object-contain"
                  />
                </button>
              </div>

              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300">
                <p className="mx-4 mb-0 text-center font-semibold">Or</p>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-2 text-xl font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:outline-none"
                  placeholder="Email address"
                  name="email"
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-2 text-xl font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:outline-none"
                  placeholder="Password"
                  name="password"
                />
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input float-left mt-1 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
                  />
                  <label className="form-check-label inline-block ">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="">
                  Forgot password?
                </a>
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="text-md inline-block rounded bg-blue-600 px-7 py-3 font-medium leading-snug text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg "
                >
                  Login
                </button>
                <p className="mt-2 mb-0 pt-1 text-sm font-semibold">
                  Don't have an account?{" "}
                  <a
                    href="register"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/register");
                    }}
                    className="text-red-600 transition duration-200 ease-in-out hover:text-red-700 focus:text-red-700"
                  >
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
