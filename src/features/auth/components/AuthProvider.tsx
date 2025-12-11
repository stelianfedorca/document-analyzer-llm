"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import { useAnonymousAuth } from "@/features/auth/hooks/useAnonymousAuth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAnonymousAuth();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
