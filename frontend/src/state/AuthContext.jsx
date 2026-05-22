/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient, { setAuthToken } from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const adminRaw = localStorage.getItem("auth.admin");
    const rawToken = localStorage.getItem("auth.token");
    if (adminRaw) {
      try {
        const parsedAdmin = JSON.parse(adminRaw);
        setAdmin(parsedAdmin);
      } catch {
        localStorage.removeItem("auth.admin");
      }
    }

    if (rawToken) {
      setToken(rawToken);
      setAuthToken(rawToken);
    }

    const studentRaw = localStorage.getItem("auth.student");
    if (studentRaw) {
      try {
        setStudent(JSON.parse(studentRaw));
      } catch {
        localStorage.removeItem("auth.student");
      }
    }
  }, []);

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  const login = (adminResponse, jwtToken) => {
    setAdmin(adminResponse);
    setToken(jwtToken);
    localStorage.setItem("auth.admin", JSON.stringify(adminResponse));
    localStorage.setItem("auth.token", jwtToken);
    setAuthToken(jwtToken);
  };

  const loginStudent = (studentResponse) => {
    setStudent(studentResponse);
    localStorage.setItem("auth.student", JSON.stringify(studentResponse));
  };

  const logout = () => {
    setAdmin(null);
    setStudent(null);
    setToken("");
    localStorage.removeItem("auth.admin");
    localStorage.removeItem("auth.student");
    localStorage.removeItem("auth.token");
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({ admin, student, token, login, loginStudent, logout }),
    [admin, student, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
