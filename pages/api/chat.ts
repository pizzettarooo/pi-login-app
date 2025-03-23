// @ts-ignore
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📥 /api/chat chiamata con metodo:", req.method)

  if (req.method !== 'POST') {
    console.warn("🚫 Metodo non permesso:", req.method)
    return res.status(405).end()
  }

  const { wallet, message } = req.body
  console.log("👛 Wallet:", wallet)
  console.log("💬 Messaggio:", message)

  const { data: user, error } = await supabase
    .from('users')
    .select('id, credits')
    .eq('wallet', wallet)
    .single()

  if (error) {
    console.error("❌ Errore Supabase:", error)
    return res.status(500).json({ error: 'Errore nel recupero utente' })
  }

  if (!user || user.credits < 1) {
    console.warn("🚫 Crediti insufficienti")
    return res.status(403).json({ error: 'Crediti insufficienti' })
  }

  try {
    const output = await replicate.run(
      "replicate/llama-2-7b-chat:55be816a6c6e41738b26c0cfc289ed76c1d66db860978305ba9f09b6b4cbaaf3",
      {
        input: {
          prompt: `You are an Italian seductive girl. Answer with charm and passion to this message:\n"${message}"`,
          temperature: 0.7,
          top_p: 0.9,
          max_new_tokens: 150,
          repetition_penalty: 1.2
        }
      }
    )

    const reply = Array.isArray(output) ? output.join('') : output
    console.log("🤖 Risposta AI:", reply)

    await supabase
      .from('users')
      .update({ credits: user.credits - 1 })
      .eq('wallet', wallet)

    return res.status(200).json({ reply })
  } catch (err: any) {
    console.error("❌ Errore Replicate:", err)
    return res.status(500).json({ error: 'Errore durante la risposta AI' })
  }
}
