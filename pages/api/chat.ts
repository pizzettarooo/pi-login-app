import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { wallet, message } = req.body

  // 1. Controllo crediti
  const { data: user } = await supabase
    .from('users')
    .select('id, credits')
    .eq('wallet', wallet)
    .single()

  if (!user || user.credits < 1) {
    return res.status(403).json({ error: 'Crediti insufficienti' })
  }

  // 2. Chiamata a Replicate con il modello OpenHermes 2 - Mistral 7B AWQ
  const output = await replicate.run(
    'antoinelyset/openhermes-2-mistral-7b-awq',
    {
      input: {
        prompt: `Sei una ragazza italiana molto seducente. Rispondi in modo coinvolgente ed erotico a questo messaggio dell'utente:\n"${message}"`,
        temperature: 0.7,
        max_new_tokens: 150,
        top_p: 0.9,
        repetition_penalty: 1.2
      }
    }
  )

  const reply = Array.isArray(output) ? output.join('') : output

  // 3. Scala 1 credito
  await supabase
    .from('users')
    .update({ credits: user.credits - 1 })
    .eq('wallet', wallet)

  // 4. Rispondi con il messaggio AI
  res.status(200).json({ reply })
}
