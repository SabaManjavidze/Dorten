import { ApolloError } from "@apollo/client";
import { useRouter } from "next/router";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { useMeLazyQuery, useMeQuery, User } from "../graphql/generated";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  errors: ApolloError;
  setUser: Dispatch<SetStateAction<User | null>>;
  setLoading: Dispatch<boolean>;
}>({} as any);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<ApolloError>(null as any);
  const [meQuery] = useMeLazyQuery();
  const getMe = async () => {
    const { data, loading, error } = await meQuery();
    console.log("me query loading : ", loading);
    if (!loading) {
      if (error) {
        setErrors(error);
      } else if (data?.me?.user) {
        setUser(data.me.user as User);
      }

      console.log("finished query", loading);
      setLoading(false);
    }
  };
  useEffect(() => {
    getMe();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, setLoading, loading: userLoading, setUser, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
