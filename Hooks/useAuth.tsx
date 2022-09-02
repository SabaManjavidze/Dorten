import { ApolloError } from "@apollo/client";
import { useRouter } from "next/router";
import {
  createContext,
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useMeQuery, User } from "../graphql/generated";

const AuthContext = createContext<{
  user: User | null;
  userLoading: boolean;
  setUser: Dispatch<SetStateAction<User | null>>;
  setUserLoading: Dispatch<boolean>;
}>({} as any);
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const { loading, error, data } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userLoading) {
      if (error || data?.me?.errors) {
        router.replace(`/login?next=${router.pathname}`);
        setUserLoading(false);
        return;
      }
      if (data?.me) {
        setUser(data.me.user as User);
      }
      setUserLoading(false);
    }
  }, [loading, data, error, userLoading]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, userLoading, setUserLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
