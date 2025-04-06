// File: /pages/api/pvp-join.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { wallet, bonus } = req.body;

  if (!wallet || !bonus) {
    return res.status(400).json({ error: 'Dati mancanti: wallet o bonus' });
  }

  try {
    // Cerca una partita in attesa
    const { data: waitingMatch, error: searchError } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'waiting')
      .limit(1)
      .maybeSingle();

    if (searchError) throw searchError;

    if (waitingMatch) {
      // Unisciti come player2
      const { data: updated, error: updateError } = await supabase
        .from('matches')
        .update({
          player2: wallet,
          bonus2: bonus,
          status: 'playing'
        })
        .eq('id', waitingMatch.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return res.status(200).json({ matchId: updated.id });
    } else {
      // Crea nuova partita
      const { data: created, error: insertError } = await supabase
        .from('matches')
        .insert([
          {
            player1: wallet,
            bonus1: bonus,
            status: 'waiting'
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      return res.status(200).json({ matchId: created.id });
    }
  } catch (err: any) {
    console.error('Errore API PvP join:', err);
    return res.status(500).json({ error: 'Errore interno' });
  }
}
