import Image from "next/image";
import { BsFillImageFill as ImgIcon } from "react-icons/bs";
import { AiOutlineLink as LinkIcon } from "react-icons/ai";
import { ChangeEvent, useRef, useState } from "react";
import {
  FieldError,
  GetPostsDocument,
  GetPostsQuery,
  Post,
  PostInput,
  useCreatePostMutation,
} from "../../graphql/generated/index";
import { toBase64 } from "../../lib/convBase64";
import { ScaleLoader } from "react-spinners";

export default function PostForm() {
  const [errors, setErros] = useState<FieldError[] | null>(null);
  const [postPicture, setPostPicture] = useState<any>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [createPost, { loading }] = useCreatePostMutation({
    update(cache, { data }) {
      const posts = cache.readQuery<GetPostsQuery>({
        query: GetPostsDocument,
        variables: { post_id: "" },
      });
      if (!posts) {
        console.log(`posts : ${posts}`);
        return;
      }
      cache.writeQuery({
        query: GetPostsDocument,
        variables: { post_id: "" },
        data: {
          getPost: [data?.createPost, ...posts.getPost],
        },
      });
    },
  });

  const handleCreatePostSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title")?.toString();
    if (!title) {
      setErros([{ field: "title", message: "title cannot be emtpy" }]);
      return;
    }
    const data: PostInput = {
      title,
      description: formData.get("description")?.toString(),
      picture: postPicture?.file || null,
    };
    if (!errors) {
      setErros(null);
    }
    await createPost({ variables: { options: data } });
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files || !event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];
    const converted = await toBase64(file);
    setPostPicture({ file: converted + "", name: file.name });
  };
  return (
    <section className="mb-10 mt-5 flex w-full justify-center px-4">
      <div className="flex w-full flex-col items-center justify-center xl:max-w-4xl">
        <h2 className="w-full text-left text-lg text-gray-200">
          Create a post
        </h2>
        <form className="w-4/5" onSubmit={handleCreatePostSubmit}>
          <div className="h-15 my-5">
            {errors && errors.length > 0 && errors[0].field == "title" ? (
              <h3 className="text-red-500 ">{errors[0].message}</h3>
            ) : null}
            <input
              type="text"
              placeholder="title"
              name="title"
              className="text-input my-5 text-lg"
            />
            <textarea
              className="max-h-15 text-input text-md"
              placeholder="Write something..."
              name="description"
            />
          </div>
          {postPicture ? (
            <div className="flex w-full flex-col justify-center pb-5">
              <h3 className="tracking-wider">{postPicture.name}</h3>
              <Image
                src={postPicture.file}
                width="100%"
                height="330px"
                alt="profile picture"
              />
            </div>
          ) : null}
          <div className="flex h-10 w-full items-center justify-between">
            <div className="flex h-full items-center justify-start">
              <button
                className="post-btn-blue group mx-2 h-full px-3"
                type="button"
                onClick={() => {
                  if (!inputRef?.current) return;
                  inputRef.current.click();
                }}
              >
                <ImgIcon className="duration-200 ease-in-out group-hover:fill-white" />
              </button>
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/png,image/gif,image/jpeg,image/webp,video/mp4,video/quicktime"
                onChange={handleImageUpload}
              />
              <button type="button" className="post-btn-blue h-full px-3">
                <LinkIcon size="20px" />
              </button>
            </div>
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
