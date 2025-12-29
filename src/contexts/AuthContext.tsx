"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  phone: string | null;
  login: (phone: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "tavati_auth_phone";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedPhone = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedPhone) {
      setPhone(savedPhone);
    }
    setIsLoading(false);
  }, []);

  const login = (phoneNumber: string) => {
    setPhone(phoneNumber);
    localStorage.setItem(AUTH_STORAGE_KEY, phoneNumber);
  };

  const logout = () => {
    setPhone(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // Don't render children until we've checked localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!phone,
        phone,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
