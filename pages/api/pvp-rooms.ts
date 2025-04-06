// FILE: pages/api/pvp-rooms.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Errore recupero room:', error);
    return res.status(500).json({ error: 'Errore durante il recupero delle room' });
  }

  return res.status(200).json({ rooms: data });
}
