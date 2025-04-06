// FILE: pages/api/pvp-rooms.ts
import { NextApiRequest, NextApiResponse } from 'next';
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

  if (error) return res.status(500).json({ error: error.message });

  const filled = data || [];
  const autoFilled = [...filled];

  while (autoFilled.length < 3) {
    const { data: newRoom } = await supabase
      .from('matches')
      .insert([{ status: 'waiting' }])
      .select()
      .single();
    if (newRoom) autoFilled.push(newRoom);
  }

  return res.status(200).json({ rooms: autoFilled });
}


// FILE: pages/api/pvp-join-room.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { wallet, roomId } = req.body;
  if (!wallet || !roomId) return res.status(400).json({ error: 'Dati mancanti' });

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('wallet', wallet)
    .maybeSingle();
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', roomId)
    .single();

  if (!match.player1) {
    await supabase.from('matches').update({ player1: user.id }).eq('id', roomId);
  } else if (!match.player2 && match.player1 !== user.id) {
    await supabase.from('matches').update({ player2: user.id }).eq('id', roomId);
  }

  return res.status(200).json({ id: roomId });
}


// FILE: pages/api/pvp-select-bonus.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { matchId, wallet, bonusSymbol } = req.body;
  if (!matchId || !wallet || !bonusSymbol)
    return res.status(400).json({ error: 'Dati mancanti' });

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('wallet', wallet)
    .maybeSingle();
  if (!user) return res.status(404).json({ error: 'Utente non trovato' });

  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single();

  const updateField = match.player1 === user.id ? 'bonus1' : 'bonus2';
  await supabase.from('matches').update({ [updateField]: bonusSymbol }).eq('id', matchId);

  return res.status(200).json({ success: true });
}


// FILE: pages/pvp-select-bonus.tsx
'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

export default function SelectBonus() {
  const router = useRouter();
  const [bonus, setBonus] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('wallet');
    if (!stored) router.push('/login');
    else setWallet(stored);
  }, []);

  const confirm = async () => {
    if (!bonus || !wallet || !router.query.id) return;
    await fetch('/api/pvp-select-bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId: router.query.id, wallet, bonusSymbol: bonus })
    });
    router.push(`/pvp-match?id=${router.query.id}`);
  };

  return (
    <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Scegli simbolo bonus 🎯</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {symbols.map((s) => (
          <button
            key={s}
            onClick={() => setBonus(s)}
            style={{
              background: bonus === s ? '#00FFAA' : '#222',
              border: '2px solid #00FFAA',
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        onClick={confirm}
        disabled={!bonus}
        style={{ background: '#FF4500', padding: '1rem 2rem', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}
      >
        Conferma simbolo
      </button>
    </div>
  );
}
