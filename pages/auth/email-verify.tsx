import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useVerifyEmailMutation } from "../../graphql/generated";

const EmailVerifyPage: NextPage = () => {
  const [verifyEmail, { loading }] = useVerifyEmailMutation();
  const router = useRouter();
  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="mb-32 p-5 md:px-28 lg:px-52 xl:px-80">
        <div className="flex w-full justify-center">
          <h2>Verify your Email</h2>
        </div>
        <label>Email</label>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email") + "";
            await verifyEmail({ variables: { email } });
            router.push("/auth/code-verify");
          }}
        >
          <input
            className="text-input text-lg"
            placeholder="useremail@gmail.com"
            required={true}
            type="email"
            name="email"
          />
          <button
            type="submit"
            className="filled-btn mt-3 bg-primary px-12 text-white hover:bg-pink-600"
          >
            {loading ? <ScaleLoader color="pink" height="25px" /> : "Send Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerifyPage;
