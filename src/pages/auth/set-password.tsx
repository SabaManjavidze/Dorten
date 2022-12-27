import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CircleLoader } from "react-spinners";
import { z } from "zod";
import SubmitButton from "../../components/General/Buttons/SubmitButton";
import InvalidText from "../../components/InvalidText";
import {
  changePassSchema,
  changePassSchemaType,
} from "../../../lib/zod/changePassword";
import { zodPassword } from "../../../lib/zod/zodTypes";
import { trpc } from "../../utils/trpc";

const SetPasswordPage: NextPage = () => {
  const { data: meData, isFetching: meLoading } = trpc.user.me.useQuery();
  const {
    mutateAsync: changePassMutation,
    data: passData,
    isLoading: passLoading,
  } = trpc.user.changePassword.useMutation();
  const router = useRouter();

  const {
    register: changePassForm,
    handleSubmit,
    formState,
  } = useForm<changePassSchemaType>({
    resolver: zodResolver(changePassSchema),
  });

  useEffect(() => {
    if (!meLoading && !meData?.email_verified) {
      router.replace("/auth/email-verify");
    }
  }, [meLoading]);
  if (meLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <CircleLoader color={"white"} />
      </div>
    );
  const onSubmit = async (data: changePassSchemaType) => {
    const { success } = await changePassMutation({ newPassword: data.pass1 });
    if (success) {
      router.push("/");
    }
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative mb-32 w-full p-5 md:px-32 lg:px-52 xl:px-80">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mt-6 pt-8">
            <label>Password</label>
            <InvalidText message={formState?.errors["pass1"]?.message} />
            <input
              className="text-input text-lg"
              placeholder="password"
              type="password"
              {...changePassForm("pass1")}
            />
          </div>
          <div className="relative mt-6 py-8">
            <label>Re-Type Password</label>
            <InvalidText message={formState?.errors["pass2"]?.message} />
            <input
              className="text-input text-lg"
              placeholder="password"
              type="password"
              {...changePassForm("pass2")}
            />
          </div>
          <SubmitButton loading={passLoading}>Submit</SubmitButton>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;
