'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const symbols = [
  'arancia', 'banana', 'bar', 'ciliegia', 'dollaro',
  'formaggio', 'fragola', 'gemma', 'interrogativo',
  'melone', 'prugna', 'sette', 'stella', 'trisette', 'uva', 'wild'
];

const winningLines = [
  [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]],
  [[0, 0], [1, 1], [2, 0]], [[0, 2], [1, 1], [2, 2]],
  [[0, 0], [1, 2], [2, 0]], [[0, 2], [1, 0], [2, 2]],
  [[0, 0], [1, 0], [2, 1]], [[0, 2], [1, 2], [2, 1]]
];

const getRandomSymbol = () => {
  const index = Math.floor(Math.random() * symbols.length);
  return symbols[index];
};

export default function PvpMatch() {
  const router = useRouter();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [match, setMatch] = useState<any>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [reelSymbols, setReelSymbols] = useState<string[][]>([[], [], []]);

  useEffect(() => {
    const idFromUrl = new URLSearchParams(window.location.search).get('id');
    const localWallet = localStorage.getItem('wallet');
    if (!idFromUrl || !localWallet) router.push('/dashboard');
    setMatchId(idFromUrl);
    setWallet(localWallet);
  }, []);

  useEffect(() => {
    if (!matchId) return;
    const interval = setInterval(fetchMatch, 2000);
    fetchMatch();
    return () => clearInterval(interval);
  }, [matchId]);

  const fetchMatch = async () => {
    const res = await fetch(`/api/pvp-get?id=${matchId}`);
    const data = await res.json();
    setMatch(data.match);
    setIsMyTurn(
      (data.match.player1 === wallet && data.match.current_turn % 2 === 0) ||
      (data.match.player2 === wallet && data.match.current_turn % 2 === 1)
    );
  };

  const spin = async () => {
    if (!match || spinning || !isMyTurn) return;
    setSpinning(true);

    const result: string[][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 3 }, getRandomSymbol)
    );
    setReelSymbols(result);

    const score = calculateScore(result, match.player1 === wallet ? match.bonus1 : match.bonus2);
    const newSymbols = [...(match.symbols || []), result];
    const newScore = match.player1 === wallet
      ? (match.score1 || 0) + score
      : (match.score2 || 0) + score;

      await fetch('/api/pvp-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          wallet,
          scoreToAdd: score,
          newSymbols: result
        })
      });
      


    fetchMatch();
    setSpinning(false);
  };

  const calculateScore = (result: string[][], bonusSymbol: string): number => {
    let count = 0;
    result.forEach(reel => {
      reel.forEach(symbol => {
        if (symbol === bonusSymbol) count++;
      });
    });

    let linePoints = 0;
    winningLines.forEach(line => {
      const values = line.map(([c, r]) => result[c][r]);
      const base = values.find(v => v !== 'wild') || values[0];
      if (values.every(v => v === base || v === 'wild')) {
        linePoints += base === bonusSymbol ? 150 : 15;
      }
    });

    return count * 10 + linePoints;
  };

  if (!match) {
    return (
      <div style={styles.page}>
        <div className="dot-spinner" />
        <p style={styles.loading}>Caricamento partita...</p>
        <style>{dotSpinnerCSS}</style>
      </div>
    );
  }

  if (match.status === 'waiting') {
    return (
      <div style={styles.page}>
        <div className="dot-spinner" />
        <p style={styles.loading}>In attesa di un avversario...</p>
        <style>{dotSpinnerCSS}</style>
      </div>
    );
  }

  const isFinished = match.current_turn >= 20;
  const myScore = match.player1 === wallet ? match.score1 : match.score2;
  const opponentScore = match.player1 === wallet ? match.score2 : match.score1;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Match PvP</h1>
      <p style={styles.score}>Tu: {myScore} | Avversario: {opponentScore}</p>
      <p style={{ marginBottom: '1rem' }}>Turno {match.current_turn + 1} / 20</p>

      {isFinished ? (
        <h2 style={{ color: '#FFD700' }}>
          {myScore > opponentScore ? 'Hai vinto! 🏆' : myScore < opponentScore ? 'Hai perso 😢' : 'Pareggio!'}
        </h2>
      ) : (
        <>
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
          <button onClick={spin} disabled={!isMyTurn || spinning} style={styles.spinButton}>
            🎰 Gira
          </button>
        </>
      )}
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
    padding: '2rem',
    color: 'white'
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    fontFamily: 'Orbitron',
    color: '#00FFFF'
  },
  score: {
    fontSize: '1.2rem',
    marginBottom: '0.5rem'
  },
  slotContainer: {
    display: 'flex',
    gap: '12px',
    padding: '1.5rem',
    borderRadius: '30px',
    background: 'linear-gradient(145deg, #4b0082, #2c003e)',
    boxShadow: 'inset 0 0 10px #000000aa, 0 10px 20px #00000080',
    border: '6px solid #8a2be2',
    marginBottom: '1.5rem'
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
    flexDirection: 'column'
  },
  symbolBox: {
    width: '100%',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spinButton: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#FF4500',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 0 #c33d00'
  },
  loading: {
    fontSize: '1.4rem',
    color: '#00FFFF',
    fontFamily: 'Orbitron'
  }
};

const dotSpinnerCSS = `
  .dot-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }

  .dot-spinner::before,
  .dot-spinner::after,
  .dot-spinner {
    content: '';
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #00FFFF;
    animation: dot-pulse 0.8s infinite ease-in-out;
  }

  .dot-spinner::before {
    animation-delay: -0.2s;
  }

  .dot-spinner::after {
    animation-delay: 0.2s;
  }

  @keyframes dot-pulse {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
`;
