'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

export default function PvpLobby() {
  const router = useRouter();
  const [bonus, setBonus] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (!storedWallet) router.push("/login");
    else setWallet(storedWallet);
  }, []);

  const handleJoin = async () => {
    if (!bonus || !wallet) return;
    setJoining(true);

    const res = await fetch('/api/pvp-join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, bonus }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/pvp-match?id=${data.matchId}`);
    } else {
      alert(data.error || 'Errore nel join PvP');
      setJoining(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Scegli il tuo simbolo bonus</h1>
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
