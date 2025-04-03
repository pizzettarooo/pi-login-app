import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [wallet, setWallet] = useState("");
  const [credits, setCredits] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (!storedWallet) {
      router.push("/login");
      return;
    }

    setWallet(storedWallet);

    fetch(`/api/getCredits?wallet=${storedWallet}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.credits !== undefined) {
          setCredits(data.credits);
        }
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("wallet");
    router.push("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          <span role="img" aria-label="slot">🎰</span> Dashboard Utente
        </h1>
        <div style={styles.walletContainer}>
          <span style={styles.walletLabel}>Wallet:</span>
          <span style={styles.walletValue}>{wallet}</span>
        </div>
        <p style={styles.credits}>Crediti disponibili: <strong>{credits}</strong></p>
        <button style={styles.button} onClick={() => router.push("/ricarica")}>
          Ricarica
        </button>
        <button style={styles.button} onClick={() => router.push("/chat")}>
          Modalità AI
        </button>
        <button style={styles.logout} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
  },
  card: {
    background: "#111",
    padding: "40px",
    borderRadius: "15px",
    boxShadow: "0 0 25px rgba(0, 255, 255, 0.3)",
    textAlign: "center" as const,
    width: "100%",
    maxWidth: "480px",
  },
  title: {
    color: "#00ffff",
    marginBottom: "25px",
    fontSize: "1.8rem",
  },
  walletContainer: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    maxWidth: "100%",
    wordBreak: "break-all",
  },
  walletLabel: {
    fontSize: "1.1rem",
    color: "#ccc",
  },
  walletValue: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: "0.9rem",
    textAlign: "center" as const,
    maxWidth: "100%",
    overflowWrap: "break-word" as const,
    padding: "5px 15px",
    wordBreak: "break-word" as const,

  },
  credits: {
    color: "#ccc",
    marginBottom: "25px",
  },
  button: {
    background: "#00d4ff",
    color: "#000",
    padding: "12px 20px",
    margin: "10px 0",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logout: {
    background: "#ff4b4b",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    width: "100%",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
