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
  const [finalSymbols, setFinalSymbols] = useState<string[][]>([[], [], []]);
  const [reelSymbols, setReelSymbols] = useState<string[][]>([[], [], []]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [turn, setTurn] = useState(0);
  const [score, setScore] = useState(0);
  const [bonusCount, setBonusCount] = useState(0);

  useEffect(() => {
    const savedBonus = localStorage.getItem('bonusSymbol');
    if (!savedBonus) {
      router.push('/ChooseBonusSymbol');
    } else {
      setBonusSymbol(savedBonus);
    }
  }, []);

  useEffect(() => {
    if (turn >= 10) {
      localStorage.removeItem('bonusSymbol');
      setTimeout(() => {
        alert(`Punti totali: ${score}\nSimboli bonus trovati: ${bonusCount}`);
        router.push('/dashboard');
      }, 500);
    }
  }, [turn]);

  const spin = () => {
    if (isSpinning || turn >= 10 || !bonusSymbol) return;
    setIsSpinning(true);

    const result: string[][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, getRandomSymbol)
    );
    setFinalSymbols(result);

    let counter = 0;
    const interval = setInterval(() => {
      setReelSymbols(Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomSymbol)));
      counter++;
      if (counter >= 20) {
        clearInterval(interval);
        setReelSymbols(result);
        calculateScore(result);
        setTurn(prev => prev + 1);
        setIsSpinning(false);
      }
    }, 60);
  };

  const calculateScore = (result: string[][]) => {
    let count = 0;
    result.forEach(reel => {
      reel.forEach(symbol => {
        if (symbol === bonusSymbol) count++;
      });
    });
    setBonusCount(prev => prev + count);
    setScore(prev => prev + count * 10);
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
      border: '6px solid #8a2be2'
    },
    reel: {
      width: '120px',
      height: '300px',
      overflow: 'hidden',
      borderRadius: '16px',
      backgroundColor: '#121212',
      border: '2px solid #ffffff55',
      boxShadow: 'inset 0 0 5px #00000099'
    },
    reelInner: {
      display: 'flex',
      flexDirection: 'column' as const,
      transition: 'transform 0.2s ease-out'
    },
    symbolBox: {
      width: '100%',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
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
    },
    score: {
      fontSize: '1.1rem',
      marginTop: '1rem',
      color: '#FFD700'
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LoveOnPi AI Slot</h1>
      {bonusSymbol && <div style={styles.bonus}>🎯 Bonus selezionato: {bonusSymbol.toUpperCase()}</div>}
      <div style={styles.slotContainer}>
        {reelSymbols.map((reel, i) => (
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
      <div style={styles.score}>Giri rimasti: {10 - turn} | Punti: {score}</div>
      <button style={styles.spinButton} onClick={spin} disabled={isSpinning}>
        🎰 Gira
      </button>
    </div>
  );
}
