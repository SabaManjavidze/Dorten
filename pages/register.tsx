import React, { useEffect, useState } from "react";
import { Copyright } from "../components/Copyright";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { FieldError, useRegisterMutation } from "../graphql/generated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InvalidText from "../components/InvalidText";
import {
  registerSchema,
  registerSchemaType,
} from "../lib/zod/registerValidation";
import Image from "next/image";
import { useAuth } from "../Hooks/useAuth";

const Register: NextPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [errors, setErrors] = useState<FieldError>();
  const [register, { loading }] = useRegisterMutation();

  const {
    register: registerForm,
    handleSubmit,
    formState,
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
  });
  const onSubmit = async (data: registerSchemaType) => {
    if (!data) return;
    const user = await register({
      variables: { options: { ...data, gender: data.gender.toUpperCase() } },
    });
    if (
      user?.data?.register?.errors?.length &&
      user.data.register.errors.length > 0
    ) {
      setErrors(user.data.register?.errors[0]);
    }
    if (user?.data?.register?.user) {
      setUser(user.data.register.user);
      router.push("/");
    }
  };

  return (
    <section className="h-screen">
      <div className="h-full px-6">
        <div
          className="g-6 flex h-full flex-wrap items-center justify-center 
        xl:justify-center"
        >
          <div className="xs:w-1/2 sm:w-3/4 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
            <div className="flex flex-row items-center justify-center">
              <p className="gradient-text p-3 text-4xl">Register With</p>
              <button
                type="button"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                className="mx-1 inline-block rounded-full bg-black p-3 
                  text-xs font-medium leading-tight shadow-md transition duration-300 
                  ease-in-out hover:bg-gray-800 hover:shadow-lg "
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
                <Image
                  src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                  width={16}
                  height={16}
                  alt="google logo"
                />
              </button>
            </div>

            <div
              className="mt-4 mb-3 flex items-center before:mt-0.5 before:flex-1 before:border-t 
              before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t 
              after:border-gray-300"
            >
              <p className="mx-4 text-center font-semibold">Or</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {errors ? (
                <div className="flex items-center py-4 text-red-400">
                  <div className="h-[5px] w-[5px] rounded bg-red-400"></div>
                  <p className="ml-5">{errors.message}</p>
                </div>
              ) : null}
              {/* --------Username and Age------------- */}
              <div className="relative flex justify-between pt-9 pb-4">
                <div className="mr-4 flex flex-col items-center justify-center">
                  <InvalidText formState={formState} field="username" />
                  <input
                    placeholder="Username"
                    {...registerForm("username", { required: true })}
                    className="text-input "
                  />
                </div>
                <div className="ml-4 flex flex-col items-center justify-center">
                  <InvalidText formState={formState} field="age" />
                  <input
                    placeholder="Age"
                    type="number"
                    {...registerForm("age", { valueAsNumber: true })}
                    className="text-input "
                  />
                </div>
              </div>
              {/* -------- Gender ------------- */}
              <div className="w-full py-3">
                <label className="mb-2 block w-full text-xs font-bold uppercase tracking-wide ">
                  Gender
                </label>
                <div className="relative w-full">
                  <select
                    className="text-input w-full appearance-none rounded-t-xl focus:rounded-b-none"
                    {...registerForm("gender")}
                  >
                    <option>None</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <svg
                      className="h-4 w-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* -------- Email and Password ------------- */}
              <div className="relative pt-7 pb-4">
                <InvalidText formState={formState} field="email" />
                <input
                  className="text-input"
                  placeholder="Email address"
                  // type="email"
                  {...registerForm("email")}
                />
              </div>

              <div className="relative pt-7 pb-4">
                <InvalidText formState={formState} field="password" />
                <input
                  className="text-input"
                  placeholder="Password"
                  type="password"
                  {...registerForm("password")}
                />
              </div>

              <div className="text-center lg:text-left">
                <button
                  type="submit"
                  className="text-md inline-block w-full
                   rounded bg-purple-500 py-3 font-medium 
                   leading-snug text-white shadow-md transition 
                   duration-200 ease-in-out hover:bg-purple-600 
                   hover:shadow-lg "
                >
                  Register
                </button>
              </div>
            </form>
            <div className="flex items-center justify-between pt-7 pb-4">
              <a href="#!" className="underline">
                Forgot password?
              </a>
              <p className="text-sm font-semibold">
                Already have an account?{" "}
                <a
                  href="login"
                  className="inline text-purple-400 underline"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Register;
