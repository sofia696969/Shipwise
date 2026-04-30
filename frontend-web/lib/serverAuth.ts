import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type AuthenticatedContext = {
  supabase: any;
  authUserId: string;
  user: {
    user_id: string;
    organization_id: string | null;
    role: string | null;
    is_super_admin: boolean | null;
    email: string | null;
  };
};

export function createAuthedClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function requireAuthContext(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<AuthenticatedContext | null> {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Unauthorized - no token" });
    return null;
  }

  const supabase = createAuthedClient(token);

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    res.status(401).json({ error: "Unauthorized - invalid token" });
    return null;
  }

  const { data: user, error: userError } = await (supabase as any)
    .from("users")
    .select("user_id, organization_id, role, is_super_admin, email")
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (userError) {
    res.status(500).json({ error: userError.message });
    return null;
  }

  if (!user) {
    // Allow authenticated users without a users table record to proceed
    // for certain actions (like submitting organization requests)
    // They will be treated as "unknown" role
    console.warn("No users record for authenticated account:", authUser.id);
    return {
      supabase,
      authUserId: authUser.id,
      user: {
        user_id: authUser.id,
        organization_id: null,
        role: null,
        is_super_admin: false,
        email: authUser.email,
      },
    };
  }

  return {
    supabase,
    authUserId: authUser.id,
    user,
  };
}