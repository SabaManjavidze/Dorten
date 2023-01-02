import { Router } from "next/router";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useColorMode } from "../hooks/useColorMode";
import { theme } from "../../tailwind.config";
import { Copyright } from "./Copyright";
import NavBar from "./NavBar/NavBar";

export default function Layout({ children }: any) {
  const { colorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setIsLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setIsLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setIsLoading(false);
    });
  }, [Router]);
  return (
    <div className={colorMode}>
      <div className="relative min-h-screen bg-skin-main text-skin-base">
        <BarLoader
          loading={isLoading}
          className="!fixed z-50 !w-full !bg-skin-secondary"
          color={theme.extend.backgroundColor.skin["loading-bar"](1)}
        />
        <NavBar />
        {children}
        <footer className="h-16 bg-skin-main">
          <Copyright
            className="absolute bottom-3 right-1/2 translate-x-1/2
        text-sm text-pink-400"
          />
        </footer>
      </div>
    </div>
  );
}
