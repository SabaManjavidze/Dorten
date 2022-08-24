import { useColorMode } from "../Hooks/useColorMode";
import { Copyright } from "./Copyright";

export default function Layout({ children }: any) {
  const { colorMode } = useColorMode();
  return (
    <div className={colorMode}>
      <div className="h-screen dark:bg-background dark:text-pink-400">
        {children}
      </div>
      <footer>
        <Copyright
          className="absolute bottom-3 right-1/2 translate-x-1/2
        text-sm text-pink-400"
        />
      </footer>
    </div>
  );
}
