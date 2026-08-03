"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getLoggedInUser } from "@/services/authService";

interface AuthContextType {
  user: any;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = () => {
    const loggedInUser = getLoggedInUser();

    console.log("Refreshing user:", loggedInUser);

    setUser(loggedInUser);
  };

  useEffect(() => {
    refreshUser();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}