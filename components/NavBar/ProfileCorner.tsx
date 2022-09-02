import { useAutoAnimate } from "@formkit/auto-animate/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMeQuery } from "../../graphql/generated";
import { NOT_FOUND_IMG } from "../../lib/variables";

export default function ProfileCorner() {
  const { loading, data, error } = useMeQuery();
  const [showMenu, setShowMenu] = useState(false);
  const profileOptions = [
    { title: "Profile", path: data?.me?.user?.username },
    { title: "Settings", path: "settings" },
    { title: "LogOut", path: "logout" },
  ];
  const [divRef] = useAutoAnimate<HTMLDivElement>();
  const SHOW_MENU_TIME = 100;
  useEffect(() => {
    if (divRef?.current) {
      if (showMenu) {
        divRef.current.style.display = "block";
        setTimeout(() => {
          if (divRef.current) divRef.current.style.opacity = "1";
        }, SHOW_MENU_TIME);
      } else {
        divRef.current.style.opacity = "0";

        setTimeout(() => {
          if (!divRef?.current) return;
          divRef.current.style.display = "none";
        }, SHOW_MENU_TIME);
      }
    }
  }, [showMenu, divRef]);

  if (loading) return <h3>loading...</h3>;
  return (
    <div className="relative flex items-center pl-16">
      {data?.me?.user ? (
        <div className="flex items-center">
          <h3 className="mr-4">{data?.me?.user.username}</h3>
          <button
            className="flex items-center"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <Image
              className="rounded-full object-cover shadow"
              src={data?.me?.user.picture || NOT_FOUND_IMG}
              width="50px"
              height="50px"
            />
          </button>
          <div
            className={`none absolute right-1/3 top-16 translate-x-1/2
            rounded border-[1.8px] border-pink-500 opacity-0 shadow-lg shadow-black/30 
            duration-200 ease-in-out
            `}
            ref={divRef}
          >
            <ul>
              {profileOptions.map((item) => (
                <li key={item.path}>
                  <Link href={`/${item.path}`}>
                    <div
                      className="cursor-pointer bg-secondary  px-10
                py-4 text-sm duration-150 ease-in-out hover:bg-background"
                    >
                      <h3 className="text-gray-200">{item.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <a>log in</a>
      )}
    </div>
  );
}
