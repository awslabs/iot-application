import { useEffect, useState, createContext, PropsWithChildren, useContext } from "react";
import { AuthUser, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import 'aws-amplify/auth/enable-oauth-listener';

// Code taken from example: https://docs.amplify.aws/react/build-a-backend/auth/add-social-provider/#custom-providers

const AuthenticatedUserContext = createContext<AuthUser | null>(null);

export const AuthenticatedUserProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const getUser = async (): Promise<void> => {
    try {
      const a = await fetchAuthSession();
      console.log(a);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          console.log('??????????????');
          getUser();
          break;
        default:
          setUser(null);
          break;
      }
    });

    getUser();

    return unsubscribe;
  }, []);

  return (
    <AuthenticatedUserContext.Provider value={user}> 
      { children }
    </AuthenticatedUserContext.Provider>
  );
};

export const useAuthenticatedUser = () => useContext(AuthenticatedUserContext);
