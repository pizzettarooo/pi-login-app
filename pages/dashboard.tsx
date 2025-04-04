import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [wallet, setWallet] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (!storedWallet) {
      router.push("/login");
      return;
    }

    setWallet(storedWallet);

    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/getCredits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: storedWallet }),
        });

        const data = await res.json();
        if (res.ok) {
          setCredits(data.credits);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Errore nel recupero crediti:", error);
      }
    };

    fetchCredits();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("wallet");
    router.push("/login");
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#111",
    padding: "2rem",
    borderRadius: "16px",
    boxShadow: "0 0 25px cyan",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#00ffff",
    marginBottom: "1.5rem",
  };

  const walletContainer: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "1.5rem",
    wordBreak: "break-word" as const,
    maxWidth: "100%",
  };

  const walletLabel: React.CSSProperties = {
    fontSize: "1rem",
    color: "#aaa",
  };

  const walletValue: React.CSSProperties = {
    fontSize: "0.9rem",
    color: "#fff",
    marginTop: "0.2rem",
  };

  const creditStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    marginBottom: "1.5rem",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.75rem 1.5rem",
    margin: "0.5rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#00ffff",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const logoutButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#ff4d4d",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          <span role="img" aria-label="slot">
            🎰
          </span>{" "}
          Dashboard Utente
        </h1>

        <div style={walletContainer}>
          <span style={walletLabel}>Wallet</span>
          <span style={walletValue}>{wallet}</span>
        </div>

        <div style={creditStyle}>Crediti disponibili: <strong>{credits}</strong></div>

        <button style={buttonStyle} onClick={() => router.push("/ricarica")}>
          Ricarica
        </button>

        <button style={buttonStyle} onClick={() => router.push("/ai-slot")}>
          Modalità AI Test Slot
        </button>

        <button style={logoutButtonStyle} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
