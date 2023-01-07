import Image from "next/image";
import { BsFillImageFill as ImgIcon } from "react-icons/bs";
import { AiOutlineLink as LinkIcon } from "react-icons/ai";
import { AiOutlineClose as ExitIcon } from "react-icons/ai";
import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScaleLoader, SyncLoader } from "react-spinners";
import { trpc } from "../../utils/trpc";
import { toBase64 } from "../../lib/convBase64";
import { useRouter } from "next/router";

type PostFormPropType = {
  dragging: boolean;
  setDragging: Dispatch<boolean>;
};

export default function PostForm({ dragging, setDragging }: PostFormPropType) {
  const router = useRouter();
  const [errors, setErros] = useState<any>(null);
  const [postPicture, setPostPicture] = useState<{
    src: string;
    id: string;
  } | null>();
  const [dropping, setDropping] = useState(false);
  const [inputs, setInputs] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const utils = trpc.useContext();

  const { mutateAsync: deleteImage, isLoading: deleteLoading } =
    trpc.deleteImage.useMutation();

  const { mutateAsync: uploadImage, isLoading: uploadLoading } =
    trpc.uploadImage.useMutation();

  const { mutateAsync: createPost, isLoading: loading } =
    trpc.post.createPost.useMutation({
      onSuccess() {
        utils.post.getPosts.invalidate();
      },
    });

  useEffect(() => {
    if (postPicture) {
      router.events.on("routeChangeStart", handleRemoveImage);
      window.addEventListener("beforeunload", handleRemoveImage);

      return () => {
        router.events.off("routeChangeStart", handleRemoveImage);
        window.removeEventListener("beforeunload", handleRemoveImage);
      };
    }
  }, [postPicture]);

  const handleRemoveImage = async () => {
    // remove image from cloudinary
    if (!postPicture) return;
    await deleteImage({ imageId: postPicture.id });
    setPostPicture(null);
  };
  const handleCreatePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title")?.toString();
    if (!title) {
      setErros([{ field: "title", message: "title cannot be emtpy" }]);
      return;
    }
    const data = {
      title,
      description: formData.get("description")?.toString() || undefined,
      picture: postPicture?.src + "",
    };
    if (!errors) {
      setErros(null);
    }
    setPostPicture(null);
    setInputs({ title: "", description: "" });
    await createPost({ ...data });
  };

  const handleImageDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const converted = await toBase64(file);
    const result = await uploadImage({ picture: converted + "" });
    if (!result) return;
    setPostPicture({ src: result.secure_url, id: result.public_id });
    setDragging(false);
    setDropping(false);
  };
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event?.target?.files || !event.target.files[0]) {
      return;
    }
    const file = event.target.files[0];
    const converted = await toBase64(file);
    const result = await uploadImage({ picture: converted + "" });
    if (!result) return;
    setPostPicture({ src: result.secure_url, id: result.public_id });
    setDragging(false);
    setDropping(false);
  };
  return (
    <section className="mb-10 mt-5 flex w-full justify-center ">
      <div className="flex w-full flex-col items-center justify-center xl:max-w-4xl">
        <h2 className="w-full text-left text-lg text-gray-200">
          Create a post
        </h2>
        <form className="w-4/5" onSubmit={handleCreatePostSubmit}>
          <div className="my-5 ">
            {errors && errors.length > 0 && errors[0].field == "title" ? (
              <h3 className="text-red-500 ">{errors[0].message}</h3>
            ) : null}
            <input
              type="text"
              placeholder="title"
              value={inputs.title}
              onChange={(e) =>
                setInputs({ ...inputs, title: e.currentTarget.value })
              }
              name="title"
              className="text-input my-5 text-lg"
            />
            <textarea
              className="max-h-15 text-input text-md"
              placeholder="Write something..."
              name="description"
              value={inputs.description}
              onChange={(e) =>
                setInputs({ ...inputs, description: e.currentTarget.value })
              }
            />
          </div>
          {uploadLoading || postPicture ? (
            <div className="flex w-full flex-col justify-center pb-5">
              <div className="flex w-full justify-between p-4">
                {/* <h3 className="tracking-wider">{postPicture.name}</h3> */}
                <button type="button" onClick={handleRemoveImage}>
                  <ExitIcon className="text-xl text-skin-button-accent" />
                </button>
              </div>
              <div className="relative h-[500px] w-full">
                {uploadLoading || deleteLoading ? (
                  <>
                    <SyncLoader
                      color={"pink"}
                      size={30}
                      className="absolute top-1/2 left-1/2 z-20 -translate-y-1/2 -translate-x-1/2"
                    />
                    <div className="absolute z-10 h-full w-full filter backdrop-blur-sm"></div>
                  </>
                ) : null}
                {postPicture ? (
                  <Image
                    src={postPicture.src}
                    layout="fill"
                    className="object-contain object-center"
                    alt="profile picture"
                  />
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="mt-4 flex h-10 w-full items-center justify-between">
            {/* file drop buttons */}
            {!dragging ? (
              <div className="flex h-full items-center justify-start border-blue-500 duration-200 ease-in-out">
                <button
                  className="post-btn-blue group mr-2 h-full px-3"
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
            ) : (
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropping(true);
                }}
                onDragExit={(e) => setDropping(false)}
                className={`post-btn-blue px-10 py-5 ${
                  dropping ? "bg-blue-500/30" : null
                }`}
              >
                <h3>Drop Your File Here!</h3>
              </div>
            )}
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
