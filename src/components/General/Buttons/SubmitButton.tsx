import React, { ReactNode } from "react";
import { ScaleLoader } from "react-spinners";

type SubmitButtonPropTypes = {
  loading: boolean;
  children?: ReactNode;
};
export default function SubmitButton({
  loading,
  children,
}: SubmitButtonPropTypes) {
  return (
    <button
      type="submit"
      className="filled-btn mt-3 bg-primary px-12 text-white hover:bg-pink-700"
    >
      {loading ? <ScaleLoader color="pink" height="25px" /> : children}
    </button>
  );
}
