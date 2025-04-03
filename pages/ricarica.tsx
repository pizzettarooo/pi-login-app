import { useEffect, useState } from "react";

export default function Ricarica() {
  const [wallet, setWallet] = useState("");

  useEffect(() => {
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) setWallet(storedWallet);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💸 Ricarica il tuo conto</h1>
        <p style={styles.text}>
          Invia Pi al seguente wallet per ricevere crediti.
        </p>
        <p style={styles.wallet}>{wallet}</p>
        <p style={styles.info}>
          Una volta ricevuto il pagamento, i tuoi crediti verranno aggiornati
          automaticamente.
        </p>
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
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#1a1a1a",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
    width: "90%",
    maxWidth: "600px",
    textAlign: "center" as const,
    color: "#eee",
  },
  title: {
    fontSize: "2rem",
    color: "#00ffff",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.1rem",
    marginBottom: "10px",
  },
  wallet: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#00bcd4",
    wordBreak: "break-all" as const,
    margin: "10px 0",
    border: "1px dashed #00bcd4",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#121212",
  },
  info: {
    marginTop: "20px",
    fontSize: "0.95rem",
    color: "#ccc",
  },
};
