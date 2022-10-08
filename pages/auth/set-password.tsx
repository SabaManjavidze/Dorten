import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const SetPasswordPage: NextPage = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (!emailVerified) {
      router.push("/auth/email-verify");
    }
  }, []);

  return (
    <div className="h-screen">
      <div className="mb-32 p-5 md:px-28 lg:px-52 xl:px-80">
        <label>Password</label>
        <input
          className="text-input text-lg"
          placeholder="password"
          type="password"
        />
        <label>Re-Type Password</label>
        <input
          className="text-input text-lg"
          placeholder="password"
          type="password"
        />
      </div>
    </div>
  );
};

export default SetPasswordPage;
