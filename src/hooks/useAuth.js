import { useContext } from "react";
import { AuthContext } from "../components/context/auth.context";

export const useAuth = () => {
  return useContext(AuthContext);
};
