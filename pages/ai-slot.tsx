import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '@fontsource/orbitron';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

const getRandomSymbol = () => {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
};

export default function AiSlot() {
  const router = useRouter();
  const [bonusSymbol, setBonusSymbol] = useState<string | null>(null);
  const [resultSymbols, setResultSymbols] = useState<string[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const savedBonus = localStorage.getItem('bonusSymbol');
    if (!savedBonus) {
      router.push('/ChooseBonusSymbol');
    } else {
      setBonusSymbol(savedBonus);
    }
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const intervals: NodeJS.Timeout[] = [];

    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        setResultSymbols(prev => {
          const updated = [...prev];
          updated[reelIndex] = Array.from({ length: 5 }, getRandomSymbol);
          return updated;
        });
        if (count > 20 + reelIndex * 10) {
          clearInterval(interval);
          if (reelIndex === 2) {
            setTimeout(() => setIsSpinning(false), 200);
          }
        }
      }, 60);
      intervals.push(interval);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #002B36, #001F2B)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    title: {
      fontFamily: 'Orbitron',
      fontSize: '2.8rem',
      fontWeight: 1100,
      color: '#00FFFF',
      textShadow: '0 0 8px #0ff, 0 0 16px #0ff',
      marginBottom: '1.2rem'
    },
    bonus: {
      fontSize: '1rem',
      marginBottom: '1rem',
      fontWeight: 'bold' as const,
      color: '#00FFAA'
    },
    slotContainer: {
      display: 'flex',
      gap: '12px',
      padding: '1.5rem',
      borderRadius: '30px',
      background: 'linear-gradient(145deg, #4b0082, #2c003e)',
      boxShadow: 'inset 0 0 10px #000000aa, 0 10px 20px #00000080',
      border: '6px solid #8a2be2',
    },
    reel: {
      width: '120px',
      height: '300px',
      overflow: 'hidden',
      borderRadius: '16px',
      backgroundColor: '#121212',
      border: '2px solid #ffffff55',
      boxShadow: 'inset 0 0 5px #00000099',
    },
    reelInner: {
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'transform 0.2s ease-out',
    },
    symbolBox: {
      width: '100%',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    spinButton: {
      marginTop: '2rem',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: 'bold' as const,
      color: '#fff',
      backgroundColor: '#FF4500',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 0 #c33d00',
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LoveOnPi AI Slot</h1>
      {bonusSymbol && <div style={styles.bonus}>🎯 Bonus selezionato: {bonusSymbol.toUpperCase()}</div>}
      <div style={styles.slotContainer}>
        {resultSymbols.map((reel, i) => (
          <div key={i} style={styles.reel}>
            <div style={styles.reelInner}>
              {reel.map((symbol, j) => (
                <div key={j} style={styles.symbolBox}>
                  <Image
                    src={`/slot-symbols/${symbol}.png`}
                    alt={symbol}
                    width={140}
                    height={140}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button style={styles.spinButton} onClick={spin} disabled={isSpinning}>
        🎰 Gira
      </button>
    </div>
  );
}
