import { ApolloError } from "@apollo/client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  FieldError,
  MeQuery,
  MeQueryResult,
  useMeQuery,
  User,
} from "../graphql/generated";

const AuthContext = createContext<{
  user: User;
  loading: boolean;
  errors: ApolloError;
  setUser: Dispatch<SetStateAction<User>>;
}>({} as any);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>({} as User);
  const [userLoading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<ApolloError>({} as ApolloError);
  const { data, loading, error } = useMeQuery();
  useEffect(() => {
    if (!loading) {
      if (error) {
        setErrors(error);
      } else {
        setUser((data?.me?.user as User) || null);
      }
      setLoading(false);
    }
  }, [loading]);
  if (userLoading) return null;
  return (
    <AuthContext.Provider
      value={{ user, loading: userLoading, setUser, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
