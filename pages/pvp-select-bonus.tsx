// FILE: pages/pvp-select-bonus.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

export default function PvpSelectBonus() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    const w = localStorage.getItem('wallet');
    if (!id || !w) router.push('/dashboard');
    setMatchId(id);
    setWallet(w);
  }, []);

  const handleConfirm = async () => {
    if (!matchId || !wallet || !selected) return;
    setLoading(true);

    const res = await fetch('/api/pvp-select-bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, wallet, bonus: selected })
    });

    const data = await res.json();
    if (res.ok) {
      router.push(`/pvp-match?id=${matchId}`);
    } else {
      alert(data.error || 'Errore');
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Scegli il tuo simbolo bonus 🎯</h1>
      <div style={styles.grid}>
        {symbols.map(sym => (
          <div
            key={sym}
            onClick={() => setSelected(sym)}
            style={{
              ...styles.symbolBox,
              boxShadow: selected === sym ? '0 0 20px 8px #00ffff88' : 'none'
            }}
          >
            <Image src={`/slot-symbols/${sym}.png`} alt={sym} width={80} height={80} />
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!selected || loading}
        style={styles.button}
      >
        {loading ? 'Caricamento...' : 'Conferma simbolo 🎮'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #002B36, #001F2B)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    padding: '2rem'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
    color: '#00FFFF',
    fontFamily: 'Orbitron'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '1rem',
    maxWidth: '480px',
    width: '100%',
    justifyItems: 'center',
    marginBottom: '2rem'
  },
  symbolBox: {
    background: '#111',
    borderRadius: '12px',
    padding: '0.5rem',
    cursor: 'pointer',
    border: '2px solid #00ffff44',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#FF4500',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #c33d00'
  }
};
