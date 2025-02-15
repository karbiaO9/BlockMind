"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  walletAddress: string | null;
}

interface AuthContextType {
  user: User | null;
  updateUserImage: (newImage: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  updateUserImage: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User);
    }
    setIsLoading(status === "loading");
  }, [session, status]);

  const updateUserImage = async (newImage: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: newImage }),
      });

      if (!response.ok) throw new Error("Failed to update avatar");
      if (!user) throw new Error("No user found");

      // Update the session with new data
      const newSession = {
        ...session,
        user: {
          ...(session?.user || {}),
          image: newImage,
        },
      };

      // Update NextAuth session
      await update(newSession);

      // Update local state with new reference
      const updatedUser = {
        ...user,
        image: newImage,
      };
      setUser(updatedUser);

      // Force a revalidation of the session
      await fetch("/api/auth/session");
    } catch (error) {
      console.error("Error updating user image:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUserImage,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
