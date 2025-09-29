import { createContext, useState } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
});

export const AuthWrapper = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
