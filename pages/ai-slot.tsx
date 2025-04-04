import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import '@fontsource/orbitron';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

export default function AiSlot() {
  const [resultSymbols, setResultSymbols] = useState([[], [], []]); // Finali
  const [isSpinning, setIsSpinning] = useState(false);
  const intervalRefs = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

  const startSpinning = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Animazione continua con simboli casuali
    const newIntervals = [0, 1, 2].map((reelIndex) =>
      setInterval(() => {
        setResultSymbols(prev => {
          const updated = [...prev];
          updated[reelIndex] = Array.from({ length: 5 }, getRandomSymbol);
          return updated;
        });
      }, 100)
    );
    intervalRefs.current = newIntervals;

    // Dopo 2.5s ferma e mostra il vero risultato
    setTimeout(() => {
      intervalRefs.current.forEach(clearInterval);
      const finalResult = Array.from({ length: 3 }, () =>
        Array.from({ length: 5 }, getRandomSymbol)
      );
      setResultSymbols(finalResult);
      setIsSpinning(false);
    }, 2500);
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
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'start'
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
      <div style={styles.slotContainer}>
        {resultSymbols.map((reel, i) => (
          <div key={i} style={styles.reel}>
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
        ))}
      </div>
      <button style={styles.spinButton} onClick={startSpinning} disabled={isSpinning}>
        🎰 Gira
      </button>
    </div>
  );
}
