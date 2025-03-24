import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet, delta } = req.body;

  if (!wallet || typeof delta !== "number") {
    return res.status(400).json({ error: "Dati mancanti o non validi" });
  }

  try {
    // Trova l'utente in base al wallet
    const { data: user, error } = await supabase
      .from("users")
      .select("id, credits")
      .eq("wallet", wallet)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const newCredits = user.credits + delta;
    if (newCredits < 0) {
      return res.status(400).json({ error: "Crediti insufficienti" });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: newCredits })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ success: true, credits: newCredits });
  } catch (err) {
    console.error("Errore in updateCredits:", err);
    return res.status(500).json({ error: "Errore interno del server" });
  }
}
