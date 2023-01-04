import { MutateOptions } from "@tanstack/react-query";
import React, { FormEvent, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { trpc } from "../../../utils/trpc";

type CommentFormPropTypes = {
  postId: string;
  mainCommentId?: string;
  refetch?: () => void;
};
export default function CommentForm({
  postId,
  mainCommentId,
  refetch,
}: CommentFormPropTypes) {
  const [errors, setErrors] = useState<any>(null);
  const utils = trpc.useContext();
  const { mutateAsync: createComment, isLoading: loading } =
    trpc.comment.addComment.useMutation({
      onSuccess() {
        if (mainCommentId) {
          utils.comment.getReplies.fetch({
            main_comment_id: mainCommentId,
          });
        }
        if (refetch) refetch();
        utils.post.getPost.invalidate({
          post_id: postId,
        });
      },
    });
  const handleCommentSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") + "";
    if (!text) {
      setErrors([
        { field: "title", message: "text needs to be more than 0 characters" },
      ]);
      return;
    }

    await createComment({
      post_id: postId,
      text,
      main_comment_id: mainCommentId,
    });
  };

  return (
    <section className="mb-10 mt-5 flex w-full justify-center ">
      <div className="flex w-full flex-col items-center justify-center xl:max-w-4xl">
        <h2 className="w-full text-left text-lg text-gray-200">
          Post A Comment
        </h2>
        <form className="w-4/5" onSubmit={handleCommentSubmit}>
          <div className="my-5 ">
            {errors && errors.length > 0 && errors[0].field == "title" ? (
              <h3 className="text-red-500 ">{errors[0].message}</h3>
            ) : null}
            <input
              type="text"
              placeholder="type a comment..."
              name="text"
              className="text-input my-5 !bg-skin-main text-lg"
            />
          </div>
          <div className="mt-4 flex h-10 w-full items-center justify-between">
            <div className="h-full">
              <button className="post-btn-pink h-full px-16" type="submit">
                <div className="flex w-1 justify-center">
                  {loading ? (
                    <ScaleLoader color="pink" height="25px" />
                  ) : (
                    <p>Submit</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
