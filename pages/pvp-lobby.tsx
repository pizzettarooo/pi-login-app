'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

export default function PvpLobby() {
  const router = useRouter();
  const [bonusSymbol, setBonusSymbol] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem('wallet');
    if (!storedWallet) {
      router.push('/login');
    } else {
      setWallet(storedWallet);
    }
  }, []);

  const handleJoin = async () => {
    if (!bonusSymbol || !wallet) return;
    setLoading(true);

    try {
      const res = await fetch('/api/pvp-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet, bonusSymbol })
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/pvp-match?id=${data.matchId}`);
      } else {
        alert(data.error || 'Errore durante il join PvP');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert('Errore di rete');
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Scegli il tuo simbolo bonus 🎯</h1>

      <div style={styles.grid}>
        {symbols.map((symbol) => (
          <div
            key={symbol}
            onClick={() => setBonusSymbol(symbol)}
            style={{
              ...styles.symbolBox,
              boxShadow: bonusSymbol === symbol
                ? '0 0 15px 6px #00ffcc, 0 0 25px 12px #00ffcc66'
                : '0 0 5px #000',
              transform: bonusSymbol === symbol ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.2s ease-in-out',
              cursor: 'pointer'
            }}
          >
            <Image
              src={`/slot-symbols/${symbol}.png`}
              alt={symbol}
              width={80}
              height={80}
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleJoin}
        disabled={!bonusSymbol || loading}
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
    color: '#00FFFF',
    textShadow: '0 0 8px #0ff, 0 0 16px #0ff',
    marginBottom: '2rem',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '2px solid #00ffcc'
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
