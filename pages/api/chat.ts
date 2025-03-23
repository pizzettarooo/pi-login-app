// @ts-ignore
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📥 API /chat chiamata con metodo:", req.method)

  if (req.method !== 'POST') {
    console.warn("🚫 Metodo non permesso:", req.method)
    return res.status(405).end()
  }

  try {
    const { wallet, message } = req.body
    console.log("📩 Messaggio ricevuto:", message)
    console.log("👛 Wallet:", wallet)

    res.status(200).json({ reply: "Funziona! Risposta test da API ✅" })
  } catch (error: any) {
    console.error("❌ Errore generico nella API /chat:", error)
    res.status(500).json({ error: 'Errore interno server' })
  }
}
