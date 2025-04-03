import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [wallet, setWallet] = useState("");
  const [credits, setCredits] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    const storedCredits = localStorage.getItem("credits");

    if (!storedWallet || !storedCredits) {
      router.push("/login");
    } else {
      setWallet(storedWallet);
      setCredits(parseInt(storedCredits));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("wallet");
    localStorage.removeItem("credits");
    router.push("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          <span role="img" aria-label="slot">🎰</span> Dashboard Utente
        </h1>
        <div style={styles.walletWrapper}>
          <p style={styles.label}>Wallet:</p>
          <p style={styles.wallet}>{wallet}</p>
        </div>
        <p style={styles.crediti}>
          Crediti disponibili: <b>{credits}</b>
        </p>

        <button style={styles.button} onClick={() => router.push("/ricarica")}>
          Ricarica
        </button>
        <button style={styles.button} onClick={() => router.push("/chat")}>
          Modalità AI
        </button>
        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  container: {
    backgroundColor: "#111",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 0 25px rgba(0, 255, 255, 0.4)",
    textAlign: "center",
    width: "100%",
    maxWidth: "500px",
  },
  title: {
    color: "#00ffff",
    fontSize: "28px",
    marginBottom: "20px",
  },
  walletWrapper: {
    wordWrap: "break-word",
    overflowWrap: "break-word",
    marginBottom: "10px",
  },
  label: {
    fontSize: "16px",
    marginBottom: "4px",
  },
  wallet: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#eee",
    wordBreak: "break-word",
  },
  crediti: {
    margin: "20px 0",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#00cfff",
    color: "#000",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    marginBottom: "10px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },
  logout: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
    marginTop: "10px",
  },
};
