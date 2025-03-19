import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("API register.ts chiamata con metodo:", req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { wallet, password } = req.body;
  console.log("Dati ricevuti:", { wallet, password });

  if (!wallet || !password) {
    return res.status(400).json({ error: 'Wallet e password sono obbligatori' });
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{ wallet, password }])
    .select();

  if (error) {
    console.error("Errore Supabase:", error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log("Registrazione completata:", data);
  return res.status(200).json({ message: 'Registrazione completata', user: data });
}
