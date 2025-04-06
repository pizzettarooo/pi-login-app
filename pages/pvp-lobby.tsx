'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

export default function PvpLobby() {
  const router = useRouter();
  const [bonus, setBonus] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    if (!bonus) return;
    setJoining(true);

    // Controlla se c'è una partita in attesa
    const { data: waitingMatch } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'waiting')
      .limit(1)
      .maybeSingle();

    if (waitingMatch) {
      // Entra nella partita come player2
      await supabase
        .from('matches')
        .update({
          player2: (await supabase.auth.getUser()).data.user?.id,
          bonus2: bonus,
          status: 'playing'
        })
        .eq('id', waitingMatch.id);

      router.push(`/pvp-match?id=${waitingMatch.id}`);
    } else {
      // Crea nuova partita come player1
      const { data, error } = await supabase
        .from('matches')
        .insert([
          {
            player1: (await supabase.auth.getUser()).data.user?.id,
            bonus1: bonus,
            status: 'waiting'
          }
        ])
        .select()
        .single();

      router.push(`/pvp-match?id=${data.id}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Scegli il tuo simbolo bonus
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        {symbols.map((sym) => (
          <button
            key={sym}
            onClick={() => setBonus(sym)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: sym === bonus ? '#00FFAA' : '#222',
              color: 'white',
              border: '2px solid #00FFAA',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {sym.toUpperCase()}
          </button>
        ))}
      </div>
      <button
        onClick={handleJoin}
        disabled={!bonus || joining}
        style={{
          marginTop: '2rem',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          backgroundColor: '#FF4500',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 0 #c33d00'
        }}
      >
        {joining ? 'Caricamento...' : 'Inizia partita PvP'}
      </button>
    </div>
  );
}
