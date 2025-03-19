import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Benvenuto!</h1>
      <p>Accedi o registrati per continuare</p>

      <button 
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }}
        onClick={() => router.push("/login")}
      >
        Login
      </button>

      <button 
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }}
        onClick={() => router.push("/register")}
      >
        Registrati
      </button>
    </div>
  );
}
