import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AiSlot() {
  const router = useRouter();

  useEffect(() => {
    const wallet = localStorage.getItem("wallet");
    if (!wallet) {
      router.push("/login");
    }
  }, []);

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

  const textStyle: React.CSSProperties = {
    fontSize: "1rem",
    color: "#ddd",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🎰 Modalità AI Test Slot</h1>
        <p style={textStyle}>
          Qui potrai testare la slot machine contro l’intelligenza artificiale. <br />
          Presto disponibile la modalità completa! 🚀
        </p>
      </div>
    </div>
  );
}
