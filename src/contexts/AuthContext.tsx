"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  phone: string | null;
  login: (phone: string) => void;
  logout: () => void;
}

interface AuthData {
  phone: string;
  expiresAt: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "tavati_auth_phone";
const AUTH_EXPIRY_DAYS = 30;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedData) {
      try {
        const authData: AuthData = JSON.parse(savedData);
        // Check if token expired
        if (authData.expiresAt > Date.now()) {
          setPhone(authData.phone);
        } else {
          // Token expired - remove it
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch {
        // Old format (just phone string) - migrate or remove
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (phoneNumber: string) => {
    setPhone(phoneNumber);
    const authData: AuthData = {
      phone: phoneNumber,
      expiresAt: Date.now() + AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
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
