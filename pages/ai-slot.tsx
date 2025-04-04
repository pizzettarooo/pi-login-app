""import React, { useState } from 'react';
import Image from 'next/image';
import '@fontsource/orbitron';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

const getRandomSymbol = () => {
  const index = Math.floor(Math.random() * symbols.length);
  return `/slot-symbols/${symbols[index]}.png`;
};

export default function AiSlot() {
  const [reels, setReels] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    const newReels = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    );

    setTimeout(() => {
      setReels(newReels);
      setSpinning(false);
    }, 1200);
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
      fontSize: '2.5rem',
      fontWeight: 1100,
      marginBottom: '1.5rem',
      color: '#00FFFF',
      textShadow: '0 0 8px #0ff, 0 0 16px #0ff'
    },
    slotWrapper: {
      display: 'flex',
      gap: '14px',
      padding: '1.5rem',
      borderRadius: '30px',
      background: 'linear-gradient(145deg, #4b0082, #2c003e)',
      boxShadow: 'inset 0 0 10px #000000aa, 0 10px 20px #00000080',
      border: '6px solid #8a2be2'
    },
    reel: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '10px'
    },
    cell: {
      backgroundColor: '#121212',
      border: '2px solid #ffffff55',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100px',
      height: '100px',
      boxShadow: 'inset 0 0 5px #00000099'
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
      boxShadow: '0 4px 0 #c33d00'
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LoveOnPi AI Slot</h1>

      <div style={styles.slotWrapper}>
        {reels.map((reel, reelIndex) => (
          <div key={reelIndex} style={styles.reel}>
            {reel.map((symbol, symbolIndex) => (
              <div key={symbolIndex} style={styles.cell}>
                {symbol && (
                  <Image
                    src={symbol}
                    alt="symbol"
                    width={100}
                    height={100}
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <button style={styles.spinButton} onClick={spin} disabled={spinning}>
        🎰 Gira
      </button>
    </div>
  );
}
