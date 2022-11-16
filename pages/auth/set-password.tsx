import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CircleLoader } from "react-spinners";
import { z } from "zod";
import SubmitButton from "../../components/General/Buttons/SubmitButton";
import InvalidText from "../../components/InvalidText";
import { useChangePasswordMutation, useMeQuery } from "../../graphql/generated";
import { zodPassword } from "../../lib/zod/zodTypes";

const SetPasswordPage: NextPage = () => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const [changePassMutation, { data: passData, loading: passLoading }] =
    useChangePasswordMutation();
  const router = useRouter();

  const changePassSchema = z
    .object({
      pass1: zodPassword,
      pass2: zodPassword,
    })
    .refine((data) => data.pass1 === data.pass2, {
      message: "Passwords should match",
      path: ["pass2"],
    });
  type changePassSchemaType = z.infer<typeof changePassSchema>;
  const {
    register: changePassForm,
    handleSubmit,
    formState,
  } = useForm<changePassSchemaType>({
    resolver: zodResolver(changePassSchema),
  });

  useEffect(() => {
    if (!meLoading && !meData?.me?.user?.email_verified) {
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
    const { data: changePassData, errors: changePassError } =
      await changePassMutation({ variables: { newPassword: data.pass1 } });
    if (!changePassError && changePassData?.changePassword.success) {
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
