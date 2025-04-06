import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const wallet = req.query.wallet as string;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet mancante' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('wallet', wallet)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    return res.status(200).json({ userId: data.id });
  } catch (err) {
    console.error('Errore getUserId:', err);
    return res.status(500).json({ error: 'Errore server' });
  }
}
