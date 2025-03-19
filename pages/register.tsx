import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [wallet, setWallet] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("✅ Registrazione completata! Ora effettua il login.");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setMessage("❌ Errore: " + data.error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Registrazione</h2>
      <input 
        type="text" 
        placeholder="Wallet" 
        value={wallet} 
        onChange={(e) => setWallet(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleRegister}>Registrati</button>
      <p>{message}</p>
    </div>
  );
}
