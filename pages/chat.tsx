import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = input.trim();
    setMessages((prev) => [...prev, `👨‍💻: ${userMessage}`]);
    setInput("");

    try {
      const res = await fetch("https://loveonpi.com/api/francesca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are Francesca, a 47-year-old housewife. You're shy, bored with your marriage, love romantic movies and gossip, and you tend to be a bit grumpy with strangers. But deep down you're warm and sweet.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      });

      const data = await res.json();

      if (data?.content) {
        setMessages((prev) => [
          ...prev,
          `💋 Francesca: ${data.content.trim()}`
        ]);

        await fetch("/api/updateCredits", { method: "POST" });
      } else {
        setMessages((prev) => [...prev, "⚠️ Nessuna risposta ricevuta"]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, "❌ Errore durante la richiesta"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Chat con Francesca 💋</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={input}
          placeholder="Scrivi qui..."
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? "..." : "Invia"}
        </button>
      </div>

      <div style={{ whiteSpace: "pre-wrap" }}>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
