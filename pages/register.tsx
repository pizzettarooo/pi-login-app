import { useState } from "react";

export default function Register() {
  const [wallet, setWallet] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!wallet || !password) {
      alert("Compila tutti i campi.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registrazione completata!");
      window.location.href = "/login";
    } else {
      alert(data.error || "Errore nella registrazione.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Registrazione Utente</h1>

        <p style={styles.description}>
          Il <strong>wallet Pi</strong> inserito serve <u>esclusivamente</u> per
          monitorare i pagamenti e ricaricare il tuo saldo crediti sul sito.
          <br />
          La <strong>password</strong> è utilizzata solo per accedere al sito:
          <u>non è collegata al Pi Network</u> e non ha nulla a che fare con le 24 parole segrete o l'accesso al tuo conto reale.
        </p>

        <input
          type="text"
          placeholder="Wallet Pi"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password (per il sito)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button} onClick={handleRegister}>
          Registrati
        </button>
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
  description: {
    fontSize: "0.95rem",
    color: "#ccc",
    marginBottom: "25px",
    lineHeight: "1.5",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #00bcd4",
    borderRadius: "8px",
    backgroundColor: "#121212",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#00bcd4",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "0.3s",
  },
};
