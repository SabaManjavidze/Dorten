import { useColorMode } from "../Hooks/useColorMode";
import { Copyright } from "./Copyright";
import NavBar from "./NavBar";

export default function Layout({ children }: any) {
  const { colorMode } = useColorMode();
  return (
    <div className={colorMode}>
      <div className="min-h-screen dark:bg-background dark:text-pink-400">
        <NavBar />
        {children}
        <footer>
          <Copyright
            className="absolute bottom-3 right-1/2 translate-x-1/2
        text-sm text-pink-400"
          />
        </footer>
      </div>
    </div>
  );
}
