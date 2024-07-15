import { createContext, Fragment, useContext, useEffect } from "react";
import { useQuery } from "../data";
import {
  getCurrentUserQuery,
  getCurrentUserResult,
  getIsLoggedInQuery,
  getIsLoggedInResult,
} from "../logic/user";
import { redirect, useLocation } from "react-router-dom";

const AuthContext = createContext({
  isLoggedIn: false,
  user: undefined,
  schema: undefined,
});

export function AuthManager(props: { isLoggedIn: boolean; children: any }) {
  let user, schema;
  const currentUserResult = useQuery(getCurrentUserQuery);
  if (props.isLoggedIn) {
    const userResult = getCurrentUserResult(currentUserResult);
    user = userResult.user;
    schema = userResult.schema;
    if (currentUserResult.loading && !user) {
      return <Fragment />;
    }
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: props.isLoggedIn,
        user,
        schema,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function AuthRedirect(props: { to: string; children: any }) {
  const location = useLocation();
  const result = useQuery(getIsLoggedInQuery);
  const isLoggedIn = getIsLoggedInResult(result);
  useEffect(() => {
    if (!result.loading && !isLoggedIn && location.pathname !== props.to) {
      redirect(props.to);
    }
  }, [result.loading, isLoggedIn]);
  if (!result.loading) {
    return <Fragment />;
  } else {
    return <AuthManager isLoggedIn={isLoggedIn}>{props.children}</AuthManager>;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}
