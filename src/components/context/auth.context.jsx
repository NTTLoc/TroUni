import { createContext, useState } from "react";

// Create container to store and share data
export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
    role: "",
  },
});

// create provider to wrap components that need to be shared data
export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
      role: "",
    },
  });

  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider
      // shared-data
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
