import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { wallet, bonusSymbol } = req.body;

  if (!wallet || !bonusSymbol) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  try {
    // 🔎 Trova utente per ID (basato su wallet)
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet', wallet)
      .maybeSingle();

    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    // 🎮 Cerca partita in attesa
    const { data: waitingMatch } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'waiting')
      .limit(1)
      .maybeSingle();

    if (waitingMatch) {
      // ✅ Entra nella partita come player2
      const { error: updateError } = await supabase
        .from('matches')
        .update({
          player2: user.id,
          bonus2: bonusSymbol,
          status: 'playing',
        })
        .eq('id', waitingMatch.id);

      if (updateError) throw updateError;

      return res.status(200).json({ matchId: waitingMatch.id });
    } else {
      // 🆕 Crea nuova partita come player1
      const { data: created, error: insertError } = await supabase
        .from('matches')
        .insert([
          {
            player1: user.id,
            bonus1: bonusSymbol,
            status: 'waiting',
          },
        ])
        .select()
        .single();

      if (insertError || !created) throw insertError;

      return res.status(200).json({ matchId: created.id });
    }
  } catch (err) {
    console.error('Errore API /pvp-join:', err);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
