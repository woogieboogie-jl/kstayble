// AI Benefit Router chat — server-side so the API key never reaches the client.
// INERT until activated: DEMO_MODE keeps the mock chat live (see lib/services/index.ts).
// To turn on real Claude, see docs/AI_INTEGRATION.md.

export const runtime = "nodejs"

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 })
  }
  try {
    const { message } = (await req.json()) as { message: string }
    // Indirect specifier so the bundler doesn't try to resolve the SDK at build
    // time (it's only installed once the integration is activated).
    const pkg = "@anthropic-ai/sdk"
    const { default: Anthropic } = await import(/* @vite-ignore */ pkg)
    const client = new Anthropic({ apiKey: key })
    const r = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system:
        "You are the K-Stayble AI Benefit Router, a concise concierge for visitors to Korea using a KRW stablecoin wallet. Recommend transport/food/shopping/reservation options and suggest converting leftover KRW into coupons or experience NFTs. Reply in the user's language (Korean or English). Keep replies under 60 words.",
      messages: [{ role: "user", content: message }],
    })
    const text = r.content.find((b: { type: string }) => b.type === "text")?.text ?? ""
    return Response.json({ reply: text })
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : "chat failed" }, { status: 500 })
  }
}
