import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - no token' });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized - invalid token' });
    }

    // Fetch staff users (organization members)
    let organizationId: string | null = null;
    try {
      const { data: staffUser } = await supabase
        .from('staff_users')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      organizationId = staffUser?.organization_id || null;
    } catch (err) {
      console.warn('Staff user fetch failed:', err);
    }

    // Fetch users in the organization
    let query = supabase
      .from('staff_users')
      .select('id, user_id, role, created_at, updated_at');

    if (organizationId) {
      query = query.eq('organization_id', organizationId);
    }

    const { data: staffUsers, error: usersError } = await query;

    if (usersError) {
      return res.status(200).json([]);
    }

    // Transform staff_users data to user format
    const users = (staffUsers || []).map((su: any) => ({
      id: su.id,
      user_id: su.user_id,
      name: `User ${su.id.slice(0, 8)}`, // Placeholder name
      email: `user.${su.id.slice(0, 8)}@shipwise.io`, // Placeholder email
      role: su.role,
      status: 'active',
      last_active: su.updated_at,
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(200).json([]);
  }
}
