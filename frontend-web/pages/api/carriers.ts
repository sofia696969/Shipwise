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

    // Create Supabase client with the token
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

    // Get current user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Unauthorized - invalid token' });
    }

    // Return all carriers (not organization-scoped)
    const { data, error } = await supabase
      .from('carriers')
      .select('*');
    
    console.log('Carriers API - User:', user.id);
    console.log('Carriers query result:', { count: data?.length, error: error?.message });
    
    if (error) {
      console.error('Carriers fetch error:', error);
      return res.status(200).json([]);
    }
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Carriers handler error:', error);
    res.status(200).json([]);
  }
}
