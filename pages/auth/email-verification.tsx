import type { NextPage } from "next";
import { useState } from "react";

const EmailVerificationPage: NextPage = () => {
  const [sent, setSent] = useState(false);
  return (
    <div className="absolute right-0 left-0 bottom-0 top-0 flex flex-col justify-center">
      <div className="mb-32 p-5 md:px-28 lg:px-52 xl:px-80">
        <div className="flex w-full justify-center">
          <h2>Verify your Email</h2>
        </div>
        <label>Email</label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const email = formData.get("email") + "";
            console.log({ email });
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
            onClick={() => setSent(true)}
            type="submit"
            className="filled-btn mt-3 bg-primary px-12 text-white hover:bg-pink-600"
          >
            Send Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
