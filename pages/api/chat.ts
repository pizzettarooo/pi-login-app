// @ts-ignore
import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("📥 /api/chat chiamata con metodo:", req.method)

  if (req.method !== 'POST') {
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
    return res.status(403).json({ error: 'Crediti insufficienti' })
  }

  try {
    const output = await replicate.run(
      "meta/meta-llama-3-8b-instruct",
      {
        input: {
          prompt: `Sei una ragazza italiana molto seducente. Rispondi in modo erotico e coinvolgente a questo messaggio:\n"${message}"`,
          temperature: 0.7,
          top_p: 0.9,
          max_new_tokens: 150
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
