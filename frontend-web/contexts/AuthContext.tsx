import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface StaffUser {
  id: string;
  user_id: string;
  role: "staff" | "supervisor" | "hr";
  department: string;
}

interface AuthContextType {
  user: User | null;
  staffUser: StaffUser | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch staff user data
          const { data } = await supabase
            .from("staff_users")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (data) {
            setStaffUser(data as StaffUser);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data } = await supabase
          .from("staff_users")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (data) {
          setStaffUser(data as StaffUser);
        }
      } else {
        setStaffUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
      });
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
      throw err;
    }
  };

 const signIn = async (email: string, password: string) => {
  try {
    setError(null);

    console.log("Signing in with:", { email, password }); // Debug log

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Supabase response:", { data, error }); // Debug log

    // Throw if Supabase returned an error
    if (error) throw error;

    // Throw if login failed (no session returned)
    if (!data.session) {
      throw new Error("Invalid email or password");
    }

    setUser(data.session.user);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Sign in failed");
    throw err;
  }
};


  const signOut = async () => {
    try {
      setError(null);
      const { error: err } = await supabase.auth.signOut();
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        staffUser,
        loading,
        error,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}