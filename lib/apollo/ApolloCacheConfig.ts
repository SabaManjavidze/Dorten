import {
  ApolloClientOptions,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from "@apollo/client";
import { concatPagination } from "@apollo/client/utilities";
import { User } from "../../graphql/generated";

// export const ApolloClientConfig: ApolloClientOptions<NormalizedCacheObject> = {
export const ApolloCacheConfig: InMemoryCacheConfig = {
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
      keyFields: ["user", ["user_id"]],
    },
    Query: {
      fields: {
        getPost: concatPagination(),
      },
    },
  },
};
