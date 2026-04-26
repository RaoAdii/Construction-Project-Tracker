import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("construction_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        window.localStorage.removeItem("construction_token");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login(credentials) {
    const response = await api.post("/auth/login", credentials);
    const { token, user: nextUser } = response.data;

    if (credentials.loginMode === "admin" && nextUser.role !== "admin") {
      const error = new Error("This account does not have admin access.");
      error.response = {
        data: { message: "This account does not have admin access." },
      };
      throw error;
    }

    window.localStorage.setItem("construction_token", token);
    setUser(nextUser);
    return nextUser;
  }

  async function register(payload) {
    const response = await api.post("/auth/register", payload);
    const { token, user: nextUser } = response.data;
    window.localStorage.setItem("construction_token", token);
    setUser(nextUser);
    return nextUser;
  }

  function logout() {
    window.localStorage.removeItem("construction_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
