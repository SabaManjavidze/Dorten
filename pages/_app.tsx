import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { User, UserResponse } from "../graphql/generated";
import { ColorModeProvider, useColorMode } from "../Hooks/useColorMode";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    connectToDevTools: true,
    uri:
      process.env.NODE_ENV == "production"
        ? "https://dorten.vercel.app/api/graphql"
        : "http://localhost:3000/api/graphql",
    cache: new InMemoryCache({
      typePolicies: {
        Post: {
          keyFields: ["post_id"],
        },
        User: {
          keyFields: ["user_id"],
        },
        Like: {
          keyFields: ["postId", "userId"],
        },
        UserResponse: {
          keyFields: function ({}, { readField }) {
            const user = readField<User>("user");
            return user?.user_id;
          },
        },
      },
    }),
  });

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
