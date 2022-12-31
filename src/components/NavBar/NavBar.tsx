import Link from "next/link";
import { useState } from "react";
import ProfileCorner from "./ProfileCorner";

export default function NavBar() {
  const [menuShown, setMenuShown] = useState(false);
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "about" },
    { title: "Services", path: "services" },
    { title: "Pricing", path: "pricing" },
    { title: "Contact", path: "contact" },
  ];
  return (
    <nav
      className="flex h-20 items-center rounded-b-md 
    border-gray-200 bg-skin-navbar px-2 sm:px-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        <a href="#" className="flex">
          LOGO
        </a>
        <button
          data-collapse-toggle="mobile-menu"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg 
          p-2 text-sm text-gray-400 
          hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden"
          onClick={() => {
            setMenuShown(!menuShown);
          }}
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`${menuShown ? "hidden" : ""} h-6 w-6`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <svg
            className={`${menuShown ? "" : "hidden"} h-6 w-6`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div
          className={`${
            menuShown ? "" : "hidden"
          } w-full items-center md:flex md:w-auto`}
          id="mobile-menu"
        >
          <ul className="mt-4 flex sm:flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
            {navLinks.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a
                    href={item.path}
                    className="block rounded py-2 
                pr-4 pl-3 text-base text-gray-400 duration-300 
                ease-in-out hover:text-gray-200 md:bg-transparent md:p-0"
                    aria-current="page"
                  >
                    {item.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="w-[270px] pl-16">
            <ProfileCorner />
          </div>
        </div>
      </div>
    </nav>
  );
}