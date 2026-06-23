// AI Benefit Router chat — server-side so the API key never reaches the client.
// Supports Google Gemini (REST, no dependency) or Anthropic Claude (SDK).
// INERT until activated: DEMO_MODE keeps the mock chat live (see lib/services/index.ts).
// Setup: docs/AI_INTEGRATION.md

export const runtime = "nodejs"

const SYSTEM =
  "You are the K-Stayble AI Benefit Router, a concise concierge for visitors to Korea using a KRW stablecoin wallet. Recommend transport/food/shopping/reservation options and suggest converting leftover KRW into coupons or experience NFTs. Reply in the user's language (Korean or English). Keep replies under 60 words."

export async function POST(req: Request) {
  const gemini = process.env.GEMINI_API_KEY
  const anthropic = process.env.ANTHROPIC_API_KEY
  if (!gemini && !anthropic) {
    return Response.json({ error: "No AI key configured (set GEMINI_API_KEY or ANTHROPIC_API_KEY)" }, { status: 503 })
  }

  let message = ""
  try {
    message = ((await req.json()) as { message: string }).message ?? ""
  } catch {
    return Response.json({ error: "bad request" }, { status: 400 })
  }

  try {
    // ── Google Gemini (preferred, no SDK needed) ───────────────────────────
    if (gemini) {
      const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${gemini}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM }] },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: { maxOutputTokens: 256, temperature: 0.7 },
          }),
        },
      )
      if (!res.ok) return Response.json({ error: `gemini ${res.status}` }, { status: 502 })
      const data = await res.json()
      const reply: string = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ?? ""
      return Response.json({ reply })
    }

    // ── Anthropic Claude (alternative; needs `pnpm add @anthropic-ai/sdk`) ──
    const pkg = "@anthropic-ai/sdk"
    const { default: Anthropic } = await import(/* @vite-ignore */ pkg)
    const client = new Anthropic({ apiKey: anthropic })
    const r = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: message }],
    })
    const reply = r.content.find((b: { type: string }) => b.type === "text")?.text ?? ""
    return Response.json({ reply })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "chat failed" }, { status: 500 })
  }
}
