import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Scalars['Boolean'];
  login: UserResponse;
  logout?: Maybe<Scalars['Boolean']>;
  register: UserResponse;
  removePost: Scalars['Boolean'];
  updatePost: Scalars['Boolean'];
  updateUser: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  options: PostInput;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UserCreateInput;
};


export type MutationRemovePostArgs = {
  post_id: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  options: PostInput;
  post_id: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  options: UserUpdateInput;
  user_id: Scalars['ID'];
};

export type Post = {
  __typename?: 'Post';
  created_at: Scalars['String'];
  creator: User;
  creator_id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
  post_id: Scalars['String'];
  title: Scalars['String'];
};

export type PostInput = {
  description?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getPost: Array<Post>;
  me?: Maybe<User>;
};


export type QueryGetPostArgs = {
  post_id?: InputMaybe<Scalars['Int']>;
};

export type User = {
  __typename?: 'User';
  age: Scalars['Int'];
  email: Scalars['String'];
  gender?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
  posts?: Maybe<Array<Post>>;
  user_id: Scalars['String'];
  username: Scalars['String'];
};

export type UserCreateInput = {
  age: Scalars['Int'];
  email: Scalars['String'];
  gender?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UserUpdateInput = {
  age?: InputMaybe<Scalars['Int']>;
  email: Scalars['String'];
  gender?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type RegisterMutationVariables = Exact<{
  options: UserCreateInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', user_id: string, username: string, email: string, picture?: string | null, gender?: string | null, age: number } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', username: string, email: string, age: number, gender?: string | null, picture?: string | null, posts?: Array<{ __typename?: 'Post', title: string }> | null } | null };


export const RegisterDocument = gql`
    mutation Register($options: UserCreateInput!) {
  register(options: $options) {
    user {
      user_id
      username
      email
      picture
      gender
      age
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    username
    email
    age
    gender
    picture
    posts {
      title
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;