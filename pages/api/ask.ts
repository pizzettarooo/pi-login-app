import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch('https://3930-62-19-242-117.ngrok-free.app/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    console.log('✅ Risposta da Ollama:', data); // per debug

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ response: data.response });
  } catch (error) {
    console.error('❌ Errore:', error);
    return res.status(500).json({ error: 'Errore nella richiesta a Ollama (ngrok)' });
  }
}
