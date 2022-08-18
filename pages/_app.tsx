import type { AppProps } from "next/app";
import { ColorModeProvider } from "../Hooks/useColorMode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorModeProvider>
      <div className="h-screen dark:bg-background dark:text-primary lowercase">
        <Component {...pageProps} />
      </div>
    </ColorModeProvider>
  );
}
export default MyApp;
