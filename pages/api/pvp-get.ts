// /pages/api/pvp-get.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { matchId } = req.query;

  if (!matchId || typeof matchId !== 'string') {
    return res.status(400).json({ error: 'ID partita mancante' });
  }

  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (err) {
    console.error('Errore in /pvp-get:', err);
    return res.status(500).json({ error: 'Errore server' });
  }
}
