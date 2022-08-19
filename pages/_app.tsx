import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ColorModeProvider, useColorMode } from "../Hooks/useColorMode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorModeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorModeProvider>
  );
}
export default MyApp;
