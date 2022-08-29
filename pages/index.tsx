import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FormEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import PostCard from "../components/PostCard";
import { BsFillImageFill as ImgIcon } from "react-icons/bs";
import { AiOutlineLink as LinkIcon } from "react-icons/ai";
import {
  FieldError,
  Post,
  PostInput,
  useCreatePostMutation,
  useGetPostsQuery,
  useLogoutMutation,
  useMeLazyQuery,
  User,
} from "../graphql/generated";
import { useAuth } from "../Hooks/useAuth";
import { NOT_FOUND_IMG } from "../lib/variables";
import { toBase64 } from "../lib/convBase64";

const Home: NextPage = () => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const { user, setUser } = useAuth();
  const [postPicture, setPostPicture] = useState<any>();
  const [posts, setPosts] = useState<Post[]>();
  const [errors, setErros] = useState<FieldError[] | null>(null);
  const [meQuery, { loading, data, error }] = useMeLazyQuery();
  const [
    createPost,
    { loading: createLoading, data: createPostData, error: createPostError },
  ] = useCreatePostMutation();
  const {
    loading: postsLoading,
    data: postsData,
    error: postsError,
  } = useGetPostsQuery({ variables: { post_id: "" } });

  const inputRef = useRef<HTMLInputElement>(null);

  const fetchMe = useCallback(async () => {
    if (user) return;
    const result = await meQuery();
    if (!loading) {
      if (result?.error) {
        router.push("/login");
        return;
      }
      if (result.data?.me?.user) {
        setUser(result.data.me.user as User);
      }
    }
  }, []);

  useEffect(() => {
    if (!postsLoading && !postsError) {
      setPosts(postsData?.getPost as Post[]);
    }
  }, [postsLoading]);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

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
    if (errors) {
      setErros(null);
    }
    if (posts && user) {
      setPosts([
        {
          ...(data as Post),
          created_at: new Date().getTime().toString(),
          creator: {
            username: user.username,
            picture: user.picture,
          } as User,
        },
        ...posts,
      ]);
    }
    await createPost({ variables: { options: data } });
  };
  return (
    <div className="w-full p-5">
      <section className="mb-10 mt-5 flex flex-col items-center justify-center px-4">
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
              className="text-input my-5"
            />
            <textarea
              className="max-h-15 text-input"
              placeholder="Write something..."
              name="description"
            />
          </div>
          {postPicture ? (
            <div className="flex w-full flex-col justify-center pb-5">
              <h3 className="tracking-wider">{postPicture.name}</h3>
              <Image src={postPicture.file} width="100%" height="330px" />
            </div>
          ) : null}
          <div className="flex h-10 w-full items-center justify-between">
            <div className="flex h-full items-center justify-start">
              <button
                className="post-btn-blue group mx-2 h-full"
                type="button"
                onClick={() => {
                  if (!inputRef?.current) return;
                  inputRef?.current.click();
                }}
              >
                <ImgIcon className="duration-200 ease-in-out group-hover:fill-white" />
              </button>
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/png,image/gif,image/jpeg,image/webp,video/mp4,video/quicktime"
                onChange={async (event) => {
                  if (!event?.target?.files || !event.target.files[0]) {
                    return;
                  }
                  const file = event.target.files[0];
                  const converted = await toBase64(file);
                  setPostPicture({ file: converted + "", name: file.name });
                }}
              />
              <button
                type="button"
                className="post-btn-blue h-full hover:text-white"
              >
                attach a link
              </button>
            </div>
            <div className="h-full">
              <button
                className="post-btn-pink h-full px-12 hover:text-white"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </section>
      <section>
        <div className="p-2 pb-10">
          <h2 className="text-3xl text-gray-100">Recent Posts</h2>
        </div>
        <div
          className="absolute right-1/2 h-[2px] w-3/4 
        translate-x-1/2 rounded bg-pink-500"
        ></div>
        <ul className="flex flex-col items-center">
          {!postsLoading ? (
            postsError ? (
              <span>Something went wrong</span>
            ) : (
              posts?.map((post) => (
                <li
                  key={post.post_id}
                  className="w-4/5 py-5 first-of-type:border-t-0"
                >
                  <PostCard post={post as Post} />
                </li>
              ))
            )
          ) : (
            <h3>Loading ...</h3>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Home;
