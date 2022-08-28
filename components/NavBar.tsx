import { useState } from "react";
import { Copyright } from "./Copyright";

export default function NavBar() {
  const [menuShown, setMenuShown] = useState(false);
  const navLinks = ["Home", "About", "Services", "Pricing", "Contact"];
  return (
    <nav
      className="rounded-b-md border-gray-200 bg-white px-2 py-2.5 
    dark:bg-[#232d42] sm:px-4"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <a href="#" className="flex">
          <svg
            className="mr-3 h-10"
            viewBox="0 0 52 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.87695 53H28.7791C41.5357 53 51.877 42.7025 51.877 30H24.9748C12.2182 30 1.87695 40.2975 1.87695 53Z"
              fill="#76A9FA"
            />
            <path
              d="M0.000409561 32.1646L0.000409561 66.4111C12.8618 66.4111 23.2881 55.9849 23.2881 43.1235L23.2881 8.87689C10.9966 8.98066 1.39567 19.5573 0.000409561 32.1646Z"
              fill="#A4CAFE"
            />
            <path
              d="M50.877 5H23.9748C11.2182 5 0.876953 15.2975 0.876953 28H27.7791C40.5357 28 50.877 17.7025 50.877 5Z"
              fill="#1C64F2"
            />
          </svg>
          <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white">
            Dorten
          </span>
        </a>
        <button
          data-collapse-toggle="mobile-menu"
          type="button"
          className="ml-3 inline-flex items-center rounded-lg 
          p-2 text-sm text-gray-500 hover:bg-gray-100 
          focus:outline-none focus:ring-2 focus:ring-gray-200 
          dark:text-gray-400 dark:hover:bg-gray-700 
          dark:focus:ring-gray-600 md:hidden"
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
          className={`${menuShown ? "" : "hidden"} w-full md:block md:w-auto`}
          id="mobile-menu"
        >
          <ul className="mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
            {navLinks.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="block rounded bg-blue-700 py-2 
                pr-4 pl-3 text-base text-gray-400 duration-300 
                ease-in-out hover:text-gray-200 md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
