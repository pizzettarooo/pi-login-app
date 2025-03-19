import { useState } from "react";
import { useRouter } from "next/router";

export default function AuthPage() {
  const [wallet, setWallet] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = async () => {
    setMessage("");
    
    const url = isLogin ? "/api/login" : "/api/register";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(`✅ ${data.message}`);

      if (isLogin) {
        // Se il login è riuscito, controlla se ha crediti
        const creditCheck = await fetch(`/api/check-credits?wallet=${wallet}`);
        const creditData = await creditCheck.json();

        if (creditData.credits >= 1) {
          router.push("/home"); // Reindirizza alla home se ha abbastanza crediti
        } else {
          router.push("/purchase"); // Reindirizza alla pagina di acquisto
        }
      }
    } else {
      setMessage(`❌ ${data.error}`);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>{isLogin ? "Login" : "Registrazione"}</h2>
      <input
        type="text"
        placeholder="Wallet"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />
      <button onClick={handleAuth} style={{ padding: "10px 20px", cursor: "pointer" }}>
        {isLogin ? "Accedi" : "Registrati"}
      </button>
      <p style={{ marginTop: "10px", cursor: "pointer" }} onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
      </p>
      {message && <p>{message}</p>}
    </div>
  );
}
