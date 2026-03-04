import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token' });
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

    // Test shipments without RLS
    console.log('Testing shipments table...');
    const { data: shipments, error: shipsError, count: shipsCount } = await supabase
      .from('shipments')
      .select('*', { count: 'exact', head: false });
    
    console.log('Shipments (with RLS):', { count: shipsCount, error: shipsError?.message, has_data: !!shipments });

    // Test with explicit limit
    const { data: shipment10, error: ships10Error } = await supabase
      .from('shipments')
      .select('*')
      .limit(10);
    
    console.log('Shipments limit(10):', { count: shipment10?.length, error: ships10Error?.message });

    // Test carriers
    const { data: carriers, error: carriersError } = await supabase
      .from('carriers')
      .select('*')
      .limit(10);

    console.log('Carriers:', { count: carriers?.length, error: carriersError?.message });

    res.status(200).json({
      shipments: shipment10?.length || 0,
      carriers: carriers?.length || 0,
      shipments_error: ships10Error?.message,
      carriers_error: carriersError?.message,
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(200).json({ error: String(error) });
  }
}
