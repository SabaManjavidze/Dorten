import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import { NOT_FOUND_IMG } from "../lib/variables";

export default function ProfileCorner() {
  const { userLoading, user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const profileOptions = ["Profile", "Settings", "LogOut"];
  if (userLoading) return <h3>user loading...</h3>;
  return (
    <div className="relative flex items-center pl-16">
      {user ? (
        <>
          <h3 className="mr-4">{user.username}</h3>
          <button
            className="flex items-center"
            onClick={() => {
              setShowMenu(!showMenu);
            }}
          >
            <Image
              className="rounded-full object-cover shadow"
              src={user.picture || NOT_FOUND_IMG}
              width="50px"
              height="50px"
            />
          </button>
          <div
            className={`absolute right-1/3 top-16 translate-x-1/2 rounded
            border-[1px] border-pink-500 duration-200 ease-in-out ${
              showMenu ? "opacity-0" : "opacity-100"
            }`}
          >
            <ul>
              {profileOptions.map((item) => (
                <li
                  className="border-b-2 border-pink-900 bg-secondary px-10 
                py-4 duration-150 ease-in-out hover:bg-secondary/50"
                >
                  <h3 className="text-gray-200">{item}</h3>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <h3>log in</h3>
      )}
    </div>
  );
}
