import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { OrganizationRecord, UserRecord } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  appUser: UserRecord | null;
  organization: OrganizationRecord | null;
  loading: boolean;
  roleResolved: boolean;
  error: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (nextPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loadProfile(session: Session | null) {
  if (!session?.user) {
    return { appUser: null, organization: null };
  }

  const { data: appUser, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (userError) throw userError;

  if (!appUser?.organization_id) {
    return { appUser: appUser as UserRecord | null, organization: null };
  }

  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("organization_id", appUser.organization_id)
    .maybeSingle();

  if (orgError) throw orgError;

  return {
    appUser: appUser as UserRecord,
    organization: organization as OrganizationRecord | null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<UserRecord | null>(null);
  const [organization, setOrganization] = useState<OrganizationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleResolved, setRoleResolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧠 prevents race conditions
  const requestId = useRef(0);

  const resolveProfile = async (session: Session | null) => {
    const currentId = ++requestId.current;

    setLoading(true);
    setRoleResolved(false);

    try {
      setUser(session?.user ?? null);

      const profile = await loadProfile(session);

      // ignore stale responses
      if (currentId !== requestId.current) return;

      setAppUser(profile.appUser);
      setOrganization(profile.organization);
      setRoleResolved(true);
    } catch (err) {
      if (currentId !== requestId.current) return;

      console.error("Auth profile error:", err);
      setError(err instanceof Error ? err.message : "Auth error");

      setAppUser(null);
      setOrganization(null);
      setRoleResolved(true);
    } finally {
      if (currentId === requestId.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;
      await resolveProfile(session);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      resolveProfile(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithGoogle = async (nextPath?: string) => {
    setError(null);

    const safeNext =
      typeof nextPath === "string" && nextPath.startsWith("/")
        ? nextPath
        : undefined;

    const redirectTo = safeNext
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          safeNext
        )}`
      : `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        scopes: "openid email profile",
      },
    });

    if (error) {
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    setError(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        appUser,
        organization,
        loading,
        roleResolved,
        error,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}