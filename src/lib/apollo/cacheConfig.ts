import {
  ApolloClientOptions,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { User } from "../../../graphql/generated";

export const cacheConfig: ApolloClientOptions<NormalizedCacheObject> = {
  connectToDevTools: true,
  uri:
    process.env.NODE_ENV == "production"
      ? "https://dorten.vercel.app/api/graphql"
      : "http://localhost:3000/api/graphql",
  cache: new InMemoryCache({
    resultCaching: true,
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
};
