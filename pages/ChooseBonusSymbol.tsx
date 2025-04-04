import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

export default function ChooseBonusSymbol() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = () => {
    if (selected) {
      localStorage.setItem('bonusSymbol', selected);
      router.push('/ai-slot'); // oppure la pagina PvP in futuro
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #001f2b, #002B36)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold' as const,
      color: '#00ffff',
      marginBottom: '1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 80px)',
      gap: '1rem',
      marginBottom: '2rem'
    },
    symbol: (isSelected: boolean) => ({
      border: isSelected ? '3px solid #00FFFF' : '2px solid #ccc',
      borderRadius: '12px',
      padding: '6px',
      backgroundColor: isSelected ? '#001f2b' : '#121212',
      cursor: 'pointer'
    }),
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      color: 'white',
      backgroundColor: '#FF4500',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Scegli il tuo simbolo bonus 🎯</h1>

      <div style={styles.grid}>
        {symbols.map((symbol) => (
          <div
            key={symbol}
            style={styles.symbol(selected === symbol)}
            onClick={() => setSelected(symbol)}
          >
            <Image
              src={`/slot-symbols/${symbol}.png`}
              alt={symbol}
              width={60}
              height={60}
            />
          </div>
        ))}
      </div>

      <button onClick={handleConfirm} style={styles.button} disabled={!selected}>
        Conferma simbolo 🎰
      </button>
    </div>
  );
}
