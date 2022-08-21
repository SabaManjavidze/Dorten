import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { AuthProvider } from "../Hooks/useAuth";
import { ColorModeProvider, useColorMode } from "../Hooks/useColorMode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ColorModeProvider>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </ColorModeProvider>
    </ApolloProvider>
  );
}
export default MyApp;
