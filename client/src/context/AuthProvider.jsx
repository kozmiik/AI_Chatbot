import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (username, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        throw new Error(data.message || "Login failed");
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Register function
  const register = async (username, password) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
