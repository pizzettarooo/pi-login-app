// /pages/api/getCredits.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { wallet } = req.body;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet non fornito" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("credits")
      .eq("wallet", wallet)
      .maybeSingle(); // 👈 Evita errore se 0 o 1 riga

    if (error) {
      console.error("Errore Supabase:", error.message);
      return res.status(500).json({ success: false, credits: 0 });
    }

    if (!data) {
      return res.status(404).json({ success: false, credits: 0 });
    }

    return res.status(200).json({ success: true, credits: data.credits });
  } catch (err) {
    console.error("❌ Errore nel recupero dei crediti:", err);
    return res.status(500).json({ success: false, credits: 0 });
  }
}
