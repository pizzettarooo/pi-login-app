import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [wallet, setWallet] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet, password }),
      });

      const data = await response.json();
      console.log("🔍 Risultato Login:", data); // Debug

      if (data.message === "Login effettuato") {
        localStorage.setItem("wallet", wallet);
        console.log("✅ Wallet salvato in localStorage:", wallet); // Debug
        router.push("/dashboard"); // Vai alla dashboard
      } else {
        alert("❌ Errore: " + data.error);
      }
    } catch (error) {
      console.error("Errore nella richiesta di login:", error);
      alert("❌ Errore nella richiesta di login");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Wallet"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
