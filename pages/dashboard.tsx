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
    } else {
      setWallet(storedWallet);
      fetch("/api/getCredits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: storedWallet }),
      })
        .then((res) => res.json())
        .then((data) => setCredits(data.credits || 0));
    }
  }, []);

  const logout = () => {
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
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    color: "#00ffff",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginTop: "1rem",
    fontSize: "1rem",
  };

  const walletStyle: React.CSSProperties = {
    wordBreak: "break-word",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    color: "#fff",
  };

  const creditsStyle: React.CSSProperties = {
    fontSize: "1.2rem",
    margin: "1rem 0",
    color: "#00ffff",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#00ffff",
    color: "#000",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    margin: "0.4rem",
    fontWeight: "bold",
    cursor: "pointer",
  };

  const logoutStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#ff4d4d",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>
          <span role="img" aria-label="slot">🎰</span> Dashboard Utente
        </h1>
        <div>
          <div style={labelStyle}>Wallet:</div>
          <div style={walletStyle}>{wallet}</div>
        </div>
        <div style={labelStyle}>Crediti disponibili:</div>
        <div style={creditsStyle}>{credits}</div>
        <div>
          <button style={buttonStyle} onClick={() => router.push("/ricarica")}>
            Ricarica
          </button>
          <button style={buttonStyle} onClick={() => router.push("/chat")}>
            Modalità AI
          </button>
          <button style={logoutStyle} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
