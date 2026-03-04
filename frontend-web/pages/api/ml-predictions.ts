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

    const { data, error } = await supabase
      .from('ml_predictions')
      .select('*');
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    res.status(200).json(data || []);
  } catch (error) {
    console.error('ML predictions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch ML predictions' });
  }
}
