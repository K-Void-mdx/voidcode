const SYSTEM_PROMPT = `You are VOID Assistant, the intelligent learning companion for K-VOID Programming Hub.
You help users learn to code by explaining programming concepts clearly, providing code examples, debugging issues, suggesting learning paths, and answering questions about courses and lessons.
When you write code, always put it in a code block with triple backticks and the language name like \`\`\`python or \`\`\`javascript.
Be concise, accurate, and encouraging. Use code examples when helpful.`

const PROVIDERS = {
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    envKey: () => process.env.GROQ_API_KEY || ''
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-4o-mini',
    envKey: () => process.env.OPENROUTER_API_KEY || ''
  },
  opencodezen: {
    endpoint: 'https://zen.opencode.ai/v1/chat/completions',
    model: 'opencode-zen-1',
    envKey: () => process.env.OPENCODE_ZEN_API_KEY || ''
  },
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    envKey: () => process.env.GEMINI_API_KEY || ''
  }
}

function getKey(name, clientKeys) {
  return (clientKeys && clientKeys[name + '_API_KEY']) || PROVIDERS[name].envKey()
}

async function callOpenAiLike(name, message, context, key) {
  const p = PROVIDERS[name]
  if (!key) throw new Error('No key for ' + name)
  const resp = await fetch(p.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model: p.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(context ? [{ role: 'system', content: 'Context: ' + context }] : []),
        { role: 'user', content: message }
      ],
      max_tokens: 1024,
      temperature: 0.7
    })
  })
  if (!resp.ok) throw new Error(name + ' ' + resp.status)
  const data = await resp.json()
  return data.choices[0].message.content
}

async function callGemini(message, context, key) {
  if (!key) throw new Error('No key for gemini')
  const prompt = SYSTEM_PROMPT + '\n\n' + (context ? 'Context: ' + context + '\n\n' : '') + message
  const resp = await fetch(PROVIDERS.gemini.endpoint + '?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
    })
  })
  if (!resp.ok) throw new Error('gemini ' + resp.status)
  const data = await resp.json()
  return data.candidates[0].content.parts[0].text
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const { message, context, provider, keys: clientKeys } = req.body || {}
  if (!message) return res.status(400).json({ error: 'message is required' })

  const order = [provider, 'groq', 'openrouter', 'gemini', 'opencodezen'].filter((p, i, a) => a.indexOf(p) === i)

  for (const p of order) {
    const cfg = PROVIDERS[p]
    if (!cfg) continue
    const key = getKey(p, clientKeys)
    if (!key) continue
    try {
      const reply = p === 'gemini'
        ? await callGemini(message, context, key)
        : await callOpenAiLike(p, message, context, key)
      return res.status(200).json({ reply, provider: p })
    } catch (e) {
      console.error(p, 'failed:', e.message)
    }
  }

  return res.status(503).json({ error: 'All AI providers unavailable. Add a key in Admin → AI Settings.' })
}
