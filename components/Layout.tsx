import { useColorMode } from "../Hooks/useColorMode";

export default function Layout({ children }) {
  const { colorMode } = useColorMode();
  return (
    <div className={colorMode}>
      <div className="h-screen dark:bg-background dark:text-pink-400">
        {children}
      </div>
    </div>
  );
}
