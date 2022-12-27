import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ColorModeProvider } from "../hooks/useColorMode";
import "../../styles/globals.css";
import { trpc } from "../utils/trpc";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorModeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ColorModeProvider>
  );
}
export default trpc.withTRPC(MyApp);
