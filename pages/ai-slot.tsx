import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  const [reels, setReels] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 5 }, getRandomSymbol))
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [bonusSymbol, setBonusSymbol] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('bonusSymbol');
    if (saved) setBonusSymbol(saved);
  }, []);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const newReels = Array.from({ length: 3 }, () => Array.from({ length: 5 }, getRandomSymbol));
    setReels(newReels);

    // Calcolo punti dopo animazione
    setTimeout(() => {
      if (bonusSymbol) {
        let count = 0;
        newReels.forEach(reel => {
          reel.forEach(symbol => {
            if (symbol === bonusSymbol) count++;
          });
        });
        setScore(prev => prev + count * 10); // 10 punti per simbolo bonus
      }
      setIsSpinning(false);
    }, 1600);
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
    reelInner: (spin: boolean) => ({
      display: 'flex',
      flexDirection: 'column' as const,
      transform: spin ? 'translateY(-240px)' : 'translateY(0)',
      transition: spin ? 'transform 1.2s ease-out' : 'none',
    }),
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
    },
    info: {
      marginTop: '1.5rem',
      fontSize: '1.1rem',
      color: '#00FFFF'
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LoveOnPi AI Slot</h1>
      <div style={styles.slotContainer}>
        {reels.map((reel, i) => (
          <div key={i} style={styles.reel}>
            <div style={styles.reelInner(isSpinning)}>
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

      {bonusSymbol && (
        <div style={styles.info}>Simbolo Bonus: <strong>{bonusSymbol}</strong></div>
      )}
      <div style={styles.info}>Punti: <strong>{score}</strong></div>
    </div>
  );
}