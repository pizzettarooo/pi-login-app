import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "10px" }}>
        🎰 Benvenuto nella Slot PvP del Futuro!
      </h1>
      <p style={{ fontSize: "1.3rem", maxWidth: "600px", marginBottom: "40px" }}>
        Sei davanti alla <strong>prima slot machine al mondo</strong> con supporto esclusivo per <strong>Pi Network</strong>,
        dove abilità e strategia si fondono in uno scontro PvP mozzafiato. Sfida altri giocatori. Vinci. Guadagna. 🔥
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        <button onClick={() => router.push("/login")} style={buttonStyle}>
          Login
        </button>
        <button onClick={() => router.push("/register")} style={buttonStyle}>
          Registrati
        </button>
      </div>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#f0f0f0",
  color: "#1e1e1e",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "1rem",
  cursor: "pointer",
  transition: "background 0.3s",
} as React.CSSProperties;
