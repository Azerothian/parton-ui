import { createContext, Fragment, useContext, useEffect } from "react";
import { useQuery } from "../data";
import { getCurrentUserQuery, getCurrentUserResult } from "../logic/user";
import { redirect, useLocation } from "react-router-dom";

const AuthContext = createContext({
  user: undefined,
});

export function AuthManager(props: { to: string; children: any }) {
  const location = useLocation();
  const currentUserResult = useQuery(getCurrentUserQuery);
  const user = getCurrentUserResult(currentUserResult);
  useEffect(() => {
    console.log("AuthManager - useEffect", currentUserResult, user);
    if (!currentUserResult.loading && !user && location.pathname !== props.to) {
      redirect(props.to);
    }
  }, [user, currentUserResult.loading]);

  if (currentUserResult.loading && !user) {
    return <Fragment />;
  }
  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// export function AuthRedirect(props: { to: string; children: any }) {
//   const location = useLocation();
//   const result = useQuery(getCurrentUserQuery);
//   const isLoggedIn = getIsLoggedInResult(result);
//   useEffect(() => {
//     if (!result.loading && !isLoggedIn && location.pathname !== props.to) {
//       redirect(props.to);
//     }
//   }, [result.loading, isLoggedIn]);
//   console.log("AuthRedirect - result", result);
//   if (!result.loading || !isLoggedIn) {
//     return <Fragment />;
//   } else {
//     console.log("AuthRedirect - AuthManager");
//     return <AuthManager to={props.to}>{props.children}</AuthManager>;
//   }
// }

export function useAuth() {
  return useContext(AuthContext);
}
