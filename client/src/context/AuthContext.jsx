import { createContext } from "react";

// Create the context
export const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});
