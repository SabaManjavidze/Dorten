import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { User } from "../graphql/generated";
import { ColorModeProvider } from "../Hooks/useColorMode";
import "../styles/globals.css";
import { cacheConfig } from "../src/lib/apollo/cacheConfig";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = new ApolloClient(cacheConfig);

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
