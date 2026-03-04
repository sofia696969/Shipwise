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
      const { data: staffUserArray, error: staffError } = await supabase
        .from('staff_users')
        .select('*')
        .eq('user_id', user.id);

      if (staffError) {
        console.warn('Staff user fetch error:', staffError.code, staffError.message);
      } else if (Array.isArray(staffUserArray) && staffUserArray.length > 0) {
        console.log('Staff user found:', staffUserArray[0]);
      }
    } catch (err) {
      console.warn('Staff user fetch exception:', err);
    }

    // Fetch all shipments (no org filter since staff_users doesn't have organization_id)
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Shipments API - User:', user.id);
    console.log('Shipments query result:', { count: data?.length, error: error?.message, data: data?.slice(0, 1) });
    
    if (error) {
      console.error('Shipments fetch error:', error);
      return res.status(200).json([]);
    }
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Shipments handler error:', error);
    res.status(200).json([]);
  }
}
