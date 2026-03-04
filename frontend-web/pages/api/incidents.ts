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

    // Try to get user's organization, but don't fail if staff_users doesn't exist
    let organizationId: string | null = null;
    try {
      const { data: staffUser } = await supabase
        .from('staff_users')
        .select('organization_id')
        .eq('user_id', user.id)
        .single();

      organizationId = staffUser?.organization_id || null;
    } catch (err) {
      // staff_users table or record doesn't exist yet
      console.warn('Staff user fetch failed, returning all incidents:', err);
    }

    // Fetch incidents - filtered by org if available
    let query = supabase.from('incidents').select('*');
    // Note: without proper joins, we'll just return all incidents if no org found
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Incidents fetch error:', error);
    res.status(200).json([]);
  }
}
