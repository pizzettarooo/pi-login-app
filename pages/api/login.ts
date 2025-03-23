import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

// Configura Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet, password } = req.body;

  if (!wallet || !password) {
    return res.status(400).json({ error: "Wallet e password sono obbligatori" });
  }

  // Controlla se l'utente esiste e se la password è corretta
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("wallet", wallet)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  return res.status(200).json({ message: "Login effettuato", user: data });
}
