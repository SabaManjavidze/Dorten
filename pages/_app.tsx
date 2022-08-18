import type { AppProps } from "next/app";
import { ColorModeProvider } from "../Hooks/useColorMode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorModeProvider>
      <Component {...pageProps} />
    </ColorModeProvider>
  );
}
export default MyApp;
