import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { NOT_FOUND_IMG } from "../../lib/variables";
import { trpc } from "../../utils/trpc";

export default function ProfileCorner() {
  const { isFetching: loading, data, error } = trpc.user.me.useQuery();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const utils = trpc.useContext();
  const { mutateAsync: logOut } = trpc.user.logout.useMutation({
    onSuccess() {
      utils.user.me.invalidate();
    },
  });
  const profileOptions = [
    { title: "Profile", path: data?.username },
    { title: "Settings", path: "settings" },
  ];
  const handleLogOut = async () => {
    router.push("/login");
    await logOut();
  };
  const divRef = useRef<HTMLDivElement>(null);
  const SHOW_MENU_TIME = 100;
  useEffect(() => {
    if (divRef?.current) {
      if (showMenu) {
        divRef.current.classList.remove("hidden");
        setTimeout(() => {
          if (divRef.current) divRef.current.style.opacity = "1";
        }, SHOW_MENU_TIME);
      } else {
        divRef.current.style.opacity = "0";
        setTimeout(() => {
          if (!divRef?.current) return;
          divRef.current.classList.add("hidden");
        }, SHOW_MENU_TIME);
      }
    }
  }, [showMenu, divRef]);

  if (loading)
    return (
      <div className="relative flex items-center pl-16">
        <h3>loading...</h3>
      </div>
    );
  if (error) {
    return (
      <Link href="/login">
        <a className="mx-6 text-light-primary">log in</a>
      </Link>
    );
  }
  return (
    <div className="relative flex items-center">
      {data ? (
        <div className="flex items-center">
          <h3 className="mr-4">{data.username}</h3>
          <button
            className="flex items-center"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <Image
              className="rounded-full object-cover shadow"
              src={data.picture || NOT_FOUND_IMG}
              width="50px"
              height="50px"
              alt="profile picture"
            />
          </button>
          <div
            onClick={() => setShowMenu(false)}
            className="fixed left-0 top-0 z-10 hidden h-full w-full opacity-0 duration-200 ease-in-out"
            ref={divRef}
          >
            <div
              className={`absolute top-20 right-36 z-20 w-36
                rounded-sm border-[1.8px] border-primary shadow-lg shadow-black/30`}
            >
              <ul>
                {profileOptions.map((item) => (
                  <li key={item.path}>
                    <Link href={`/${item.path}`}>
                      <div
                        className="cursor-pointer bg-skin-secondary  px-10
                py-4 text-sm duration-150 ease-in-out hover:bg-skin-main"
                      >
                        <h3 className="text-gray-200">{item.title}</h3>
                      </div>
                    </Link>
                  </li>
                ))}
                <li key={"logout"}>
                  <button
                    onClick={handleLogOut}
                    className="w-full cursor-pointer bg-skin-secondary px-10
                py-4 text-sm duration-150 ease-in-out hover:bg-skin-main"
                  >
                    <h3 className="text-gray-200">logout</h3>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <Link href="/login">
          <a className="text-light-primary">log in</a>
        </Link>
      )}
    </div>
  );
}
