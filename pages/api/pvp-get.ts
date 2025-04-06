import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const matchId = req.query.id as string;

  if (!matchId) {
    return res.status(400).json({ error: 'ID mancante' });
  }

  try {
    const { data: match, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (error) throw error;

    if (!match) {
      return res.status(404).json({ error: 'Partita non trovata' });
    }

    return res.status(200).json({ match });
  } catch (err) {
    console.error('Errore API /pvp-get:', err);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
