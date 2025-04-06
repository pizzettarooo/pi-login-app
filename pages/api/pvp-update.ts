// File: /pages/api/pvp-update.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { matchId, wallet, scoreToAdd, newSymbols } = req.body;

  if (!matchId || !wallet || typeof scoreToAdd !== 'number' || !Array.isArray(newSymbols)) {
    return res.status(400).json({ error: 'Dati non validi' });
  }

  try {
    // Recupera utente dal wallet
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('wallet', wallet)
      .maybeSingle();

    if (!user) return res.status(404).json({ error: 'Utente non trovato' });

    // Recupera partita corrente
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError || !match) throw matchError;

    const isPlayer1 = match.player1 === user.id;
    const isPlayer2 = match.player2 === user.id;

    if (!isPlayer1 && !isPlayer2) {
      return res.status(403).json({ error: 'Utente non parte della partita' });
    }

    const updated = {
      symbols: [...(match.symbols || []), newSymbols],
      current_turn: (match.current_turn || 0) + 1,
      score1: isPlayer1 ? (match.score1 || 0) + scoreToAdd : match.score1,
      score2: isPlayer2 ? (match.score2 || 0) + scoreToAdd : match.score2,
    };

    const { error: updateError } = await supabase
      .from('matches')
      .update(updated)
      .eq('id', matchId);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Errore API /pvp-update:', err);
    return res.status(500).json({ error: 'Errore interno del server' });
  }
}
