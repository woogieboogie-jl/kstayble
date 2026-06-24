// Shared Gemini (Generative Language API) caller. Tries a few model names so a
// key that lacks one (404) still works via another. Server-side only.

const CANDIDATES = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-flash-latest", "gemini-pro-latest"]

export interface GeminiResult {
  reply?: string
  error?: string
}

export async function geminiGenerate(opts: {
  key: string
  system: string
  message: string
  maxOutputTokens?: number
  temperature?: number
}): Promise<GeminiResult> {
  const models = [process.env.GEMINI_MODEL, ...CANDIDATES].filter((m): m is string => !!m)
  const seen = new Set<string>()
  let lastErr = "no model tried"

  for (const model of models) {
    if (seen.has(model)) continue
    seen.add(model)
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${opts.key}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: opts.system }] },
            contents: [{ role: "user", parts: [{ text: opts.message }] }],
            generationConfig: {
              maxOutputTokens: opts.maxOutputTokens ?? 512,
              temperature: opts.temperature ?? 0.5,
            },
          }),
        },
      )
      if (res.ok) {
        const data = await res.json()
        const reply: string =
          data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ?? ""
        if (reply.trim()) return { reply }
        lastErr = `empty reply from ${model}`
        continue
      }
      const body = await res.text().catch(() => "")
      lastErr = `${res.status} ${model}: ${body.slice(0, 180)}`
      // 404 = this model isn't available for the key → try the next candidate.
      // Any other status (400/403/429/5xx) won't be fixed by a different model.
      if (res.status !== 404) break
    } catch (e) {
      lastErr = `${model}: ${e instanceof Error ? e.message : "fetch failed"}`
    }
  }
  return { error: lastErr }
}
