import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, FormEventHandler, useState } from "react";
import { ScaleLoader } from "react-spinners";
import SubmitButton from "../../components/General/Buttons/SubmitButton";
import { trpc } from "../../utils/trpc";

const CodeVerifyPage: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { mutateAsync: verifyCode, isLoading: loading } =
    trpc.user.verifyCode.useMutation({
      onSuccess() {
        utils.user.me.invalidate();
      },
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") + "";
    const success = await verifyCode({
      code,
    });
    if (success) {
      router.push("/auth/set-password");
    }
  };

  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="mb-32 p-5 md:px-28 lg:px-52 xl:px-80">
        <div className="flex w-full justify-center">
          <h2>Verify Code</h2>
        </div>
        <label>Code</label>
        <form onSubmit={handleSubmit}>
          <input
            className="text-input text-lg"
            placeholder="ex: 342323"
            required={true}
            type="number"
            name="code"
          />
          <SubmitButton loading={loading}>Submit</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default CodeVerifyPage;
