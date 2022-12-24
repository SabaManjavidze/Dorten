import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";
import {
  GetPostQuery,
  useAddCommentMutation,
  GetPostDocument,
  Comment,
  FieldError,
} from "../../../graphql/generated";

type CommentFormPropTypes = {
  postId: string;
};
export default function CommentForm({ postId }: CommentFormPropTypes) {
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const [createComment, { loading }] = useAddCommentMutation({
    update(cache, { data }) {
      const posts = cache.readQuery<GetPostQuery>({
        query: GetPostDocument,
        variables: { post_id: postId },
      });
      if (!posts) return;

      const comments = posts?.getPost[0]?.comments ?? [];
      const newComments = [data?.addComment as Comment, ...comments];
      const newPost = { ...posts.getPost[0], comments: newComments };
      cache.writeQuery({
        query: GetPostDocument,
        variables: { post_id: postId },
        data: {
          getPost: [newPost],
        },
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
    await createComment({ variables: { postId, text } });
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
