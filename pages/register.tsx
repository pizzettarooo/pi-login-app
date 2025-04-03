import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [wallet, setWallet] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !wallet || !password) {
      alert("Compila tutti i campi.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, wallet, password }),
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
        <h1 style={styles.title}>Registrati</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Wallet Pi"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
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
    maxWidth: "500px",
    textAlign: "center" as const,
    color: "#eee",
  },
  title: {
    fontSize: "2rem",
    color: "#00ffff",
    marginBottom: "20px",
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
