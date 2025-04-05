'use client';

import React from 'react';
import Link from 'next/link';
import '@fontsource/orbitron';

export default function HomePage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}><span style={styles.cyan}>Benvenuto nella</span> <span style={styles.pink}>Slot PvP del Futuro</span>!</h1>
      <p style={styles.subtitle}>
        Sei davanti alla <strong>prima slot machine al mondo</strong> con supporto esclusivo per <strong>Pi Network</strong>,
        dove <span style={styles.accent}>abilità</span> e <span style={styles.accent}>strategia</span> si fondono in uno scontro PvP mozzafiato.
        <br />Sfida altri giocatori. Vinci. Guadagna. <span style={styles.emoji}>🔥</span>
      </p>
      <div style={styles.buttons}>
        <Link href="/login" style={styles.button}>Login</Link>
        <Link href="/register" style={styles.button}>Registrati</Link>
      </div>
      <p style={styles.love}>Love On Pi</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #001f2b, #002b36)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    textAlign: 'center' as const,
    padding: '2rem',
    fontFamily: 'Orbitron'
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: 900,
    marginBottom: '1.2rem',
    textShadow: '0 0 12px #00ffff, 0 0 32px #ff00ff'
  },
  cyan: {
    color: '#00FFFF',
    textShadow: '0 0 8px #00ffffaa, 0 0 16px #00ffff66'
  },
  pink: {
    color: '#FF00FF',
    textShadow: '0 0 8px #FF00FFaa, 0 0 16px #FF00FF66'
  },
  subtitle: {
    fontSize: '1.1rem',
    maxWidth: '600px',
    marginBottom: '2rem',
    lineHeight: '1.6'
  },
  accent: {
    color: '#FFD700',
    fontWeight: 'bold' as const
  },
  emoji: {
    fontSize: '1.2rem'
  },
  buttons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  button: {
    backgroundColor: '#111',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: 'bold' as const,
    fontSize: '1rem',
    border: '2px solid #00FFFF',
    boxShadow: '0 0 8px #00FFFF66',
    transition: 'all 0.3s ease-in-out'
  } as React.CSSProperties,
  love: {
    marginTop: '0.5rem',
    fontSize: '1.2rem',
    color: '#FF00FF',
    textShadow: '0 0 6px #ff00ff88, 0 0 12px #ff00ffaa',
    fontWeight: 'bold' as const
  }
};