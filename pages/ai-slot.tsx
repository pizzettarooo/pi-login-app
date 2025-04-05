// File: ai-slot.tsx aggiornato con logica corretta vincite sparse + glow bonus

'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import '@fontsource/orbitron';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

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
    if (!savedBonus) router.push('/ChooseBonusSymbol');
    else setBonusSymbol(savedBonus);
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

    let totalPoints = 0;
    const columns = [0, 1, 2].map(col => [result[0][col], result[1][col], result[2][col]]);
    const symbolsToCheck = symbols.filter(s => s !== 'wild');

    symbolsToCheck.forEach(sym => {
      let counts = [0, 0, 0];
      for (let col = 0; col < 3; col++) {
        if (columns[col].includes(sym)) counts[col] = 1;
        else if (columns[col].includes('wild')) counts[col] = 2;
      }

      const numSym = counts.filter(c => c === 1).length;
      const numWild = counts.filter(c => c === 2).length;

      if (numSym + numWild >= 3) {
        if (sym === bonusSymbol) {
          if (numSym === 3) totalPoints += 150;
          else if (numSym === 2 && numWild === 1) totalPoints += 70;
          else if (numSym === 1 && numWild === 2) totalPoints += 50;
        } else {
          if (numSym === 3) totalPoints += 15;
          else if (numSym === 2 && numWild === 1) totalPoints += 10;
          else if (numSym === 1 && numWild === 2) totalPoints += 5;
        }
      }
    });

    setBonusCount(prev => prev + count);
    setScore(prev => prev + count * 10 + totalPoints);
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
      flexDirection: 'column' as const
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
            <div
              style={{
                ...styles.reelInner,
                animation: !isSpinning ? 'reelStop 0.3s ease-out forwards' : 'none',
                animationDelay: !isSpinning ? `${i * 0.3}s` : '0s'
              }}
            >
              {reel.map((symbol, j) => {
                const isBonus = symbol === bonusSymbol;
                return (
                  <div
                    key={j}
                    style={{
                      ...styles.symbolBox,
                      borderRadius: isBonus ? '14px' : '0',
                      animation: isBonus ? 'pulseGlow 1s infinite' : 'none',
                      boxShadow: isBonus
                        ? '0 0 15px 6px #00ffcc, 0 0 25px 12px #00ffcc66'
                        : 'none'
                    }}
                  >
                    <Image
                      src={`/slot-symbols/${symbol}.png`}
                      alt={symbol}
                      width={140}
                      height={140}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.score}>Giri rimasti: {10 - turn} | Punti: {score}</div>
      <button style={styles.spinButton} onClick={spin} disabled={isSpinning}>🎰 Gira</button>

      <style>{`
        @keyframes pulseGlow {
          0% { transform: scale(1); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
        @keyframes reelStop {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
