import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import ProfileCorner from "./ProfileCorner";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const routes = [
    { name: "Home", route: "/" },
    { name: "About", route: "/about" },
    { name: "Services", route: "/services" },
  ];
  const [divRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <nav className="flex flex-col items-center justify-between bg-skin-navbar px-4 py-3 shadow-md ">
      {/* Website Logo */}
      <div className="flex w-full justify-between">
        <div className="mr-6 flex items-center text-white">
          <Link href="/">
            <a className="ml-5 text-xl font-semibold tracking-tight">Dorten</a>
          </Link>
        </div>
        {/* Routes Link on Desktop */}
        <div className="hidden w-full flex-grow lg:flex lg:w-auto lg:items-center">
          {routes.map(({ name, route }) => (
            <Link href={route} key={name}>
              <a className="mt-4 mr-4 block text-gray-500 hover:text-white lg:mt-0 lg:inline-block">
                {name}
              </a>
            </Link>
          ))}
        </div>

        {/* Profile Picture */}
        <div className="mr-10 flex items-center">
          <ProfileCorner />
        </div>
        <div className="flex flex-col items-center justify-center lg:flex-row">
          {/* Hamburger Menu Button */}
          <div className="block lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center rounded border border-gray-600 px-3 py-2 text-gray-500 hover:border-white hover:text-white"
            >
              <FaBars size={15} />
            </button>
          </div>
        </div>
      </div>
      {/* Routes Links for Mobile*/}
      <div ref={divRef} className={"rounded bg-skin-secondary lg:hidden "}>
        {menuOpen
          ? routes.map(({ name, route }) => (
              <Link href={route} key={name}>
                <a className="mt-4 block text-center text-skin-base/90 duration-700 hover:text-white lg:mt-0 lg:inline-block">
                  {name}
                </a>
              </Link>
            ))
          : null}
      </div>
    </nav>
  );
};

export default NavBar;
