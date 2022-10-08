import type { NextPage } from "next";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import { useVerifyCodeMutation } from "../../graphql/generated";

const CodeVerifyPage: NextPage = () => {
  const [verifyCode, { loading }] = useVerifyCodeMutation();
  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="mb-32 p-5 md:px-28 lg:px-52 xl:px-80">
        <div className="flex w-full justify-center">
          <h2>Verify Code</h2>
        </div>
        <label>Code</label>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const code = parseInt(formData.get("code") + "");
            await verifyCode({ variables: { code } });
          }}
        >
          <input
            className="text-input text-lg"
            placeholder="ex: 342323"
            required={true}
            datatype="number"
            name="code"
          />
          <button
            type="submit"
            className="filled-btn mt-3 bg-primary px-12 text-white hover:bg-pink-600"
          >
            {loading ? <ScaleLoader color="pink" height="25px" /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CodeVerifyPage;
