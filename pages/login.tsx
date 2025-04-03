import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [wallet, setWallet] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("wallet", wallet);
      router.push("/dashboard");
    } else {
      alert(data.error || "Errore durante il login");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔐 Accesso Utente</h1>
        <input
          style={styles.input}
          type="text"
          placeholder="Wallet Pi"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Entra
        </button>
        <p style={styles.registerText}>
          Non hai un account?{" "}
          <span
            style={styles.link}
            onClick={() => router.push("/register")}
          >
            Registrati qui
          </span>
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
    maxWidth: "400px",
    textAlign: "center" as const,
    color: "#eee",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#00ffff",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #00bcd4",
    backgroundColor: "#121212",
    color: "#fff",
    fontSize: "1rem",
  },
  button: {
    padding: "12px",
    width: "100%",
    backgroundColor: "#00bcd4",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  registerText: {
    marginTop: "20px",
    fontSize: "0.9rem",
  },
  link: {
    color: "#00ffff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
