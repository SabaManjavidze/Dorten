import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ColorModeProvider } from "../hooks/useColorMode";
import { useApollo } from "../lib/apollo/ApolloClient";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const client = useApollo(pageProps);
  return (
    <ApolloProvider client={client}>
      <ColorModeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ColorModeProvider>
    </ApolloProvider>
  );
}
export default MyApp;
