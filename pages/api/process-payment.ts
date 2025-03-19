import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ error: "Wallet obbligatorio" });
  }

  // Aggiorna i crediti dell'utente
  const { data, error } = await supabase
    .from("users")
    .update({ credits: 1 }) // Aggiunge 1 credito all'utente
    .eq("wallet", wallet);

  if (error) {
    return res.status(500).json({ error: "Errore durante l'aggiornamento del credito" });
  }

  return res.status(200).json({ success: true, message: "Credito aggiornato!" });
}
