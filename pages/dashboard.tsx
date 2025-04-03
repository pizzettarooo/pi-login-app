import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (!storedWallet) {
      router.push("/login");
    } else {
      setWallet(storedWallet);
      fetchCredits(storedWallet);
    }
  }, []);

  const fetchCredits = async (wallet: string) => {
    try {
      const response = await fetch("/api/getCredits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet }),
      });
      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Errore durante il recupero dei crediti:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wallet");
    router.push("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🎰 Dashboard Utente</h1>
        <p style={styles.text}>Wallet: <strong>{wallet}</strong></p>
        <p style={styles.text}>Crediti disponibili: <strong>{credits ?? "Caricamento..."}</strong></p>
        <div style={styles.buttons}>
          <button style={styles.button} onClick={() => router.push("/ricarica")}>Ricarica</button>
          <button style={styles.button} onClick={() => router.push("/chat")}>Modalità AI</button>
          <button style={styles.logout} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#eee",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
    width: "90%",
    maxWidth: "500px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#00ffff",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "10px",
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    background: "#00bcd4",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#fff",
    transition: "background 0.2s",
  },
  logout: {
    padding: "10px 20px",
    background: "#e53935",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#fff",
    marginTop: "10px",
  },
};
