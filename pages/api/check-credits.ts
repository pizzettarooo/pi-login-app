import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet } = req.query;
  if (!wallet) {
    return res.status(400).json({ error: "Wallet obbligatorio" });
  }

  const { data, error } = await supabase
    .from("users")
    .select("credits")
    .eq("wallet", wallet)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Utente non trovato" });
  }

  return res.status(200).json({ credits: data.credits });
}
