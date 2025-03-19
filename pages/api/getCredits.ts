import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Metodo non consentito" });

  const { wallet } = req.body;
  if (!wallet) return res.status(400).json({ error: "Wallet non fornito" });

  try {
    const { data, error } = await supabase.from("users").select("credits").eq("wallet", wallet).single();

    if (error || !data) return res.json({ success: false, credits: 0 });

    return res.json({ success: true, credits: data.credits });
  } catch (error) {
    console.error("Errore nel recupero dei crediti:", error);
    return res.status(500).json({ error: "Errore nel server" });
  }
}
