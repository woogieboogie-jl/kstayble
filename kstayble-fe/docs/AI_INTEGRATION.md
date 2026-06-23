# Activating the real AI chat (Claude)

The AI Benefit Router chat is **mocked** today (keyword-matched canned replies in
`lib/services/mock.ts`). The wiring for a real Claude-powered chat is already in
place and **inert** — turning it on is 3 steps, no screen changes.

## What's already there
- `app/api/chat/route.ts` — server-side Route Handler that calls Claude. Returns
  `503` until `ANTHROPIC_API_KEY` is set; dynamically imports the SDK so the build
  never breaks while the package is absent.
- `lib/services/index.ts` → `realBenefitService.chat` — POSTs to `/api/chat`.
- `benefitService = DEMO_MODE ? mock : real` — so flipping the flag swaps the
  whole chat path. `app/ai/page.tsx` needs **zero** changes (already awaits `chat()`).

## To activate (when you have an Anthropic API key)
1. `pnpm add @anthropic-ai/sdk`
2. Create `.env.local` (git-ignored, **server-only — never** `NEXT_PUBLIC_*`):
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   NEXT_PUBLIC_DEMO_MODE=false
   ```
   > `NEXT_PUBLIC_DEMO_MODE=false` makes ALL services use the `real*` adapters.
   > `recommend()`/identity/etc. still throw NotImplemented. If you want ONLY the
   > chat live while everything else stays mocked, add a separate flag
   > (e.g. `NEXT_PUBLIC_AI_LIVE`) and gate just `benefitService.chat`.
3. Restart `pnpm dev`. The chat now streams real Claude replies (model
   `claude-opus-4-8`), bilingual (KO/EN), key stays server-side.

## Notes
- Non-streaming `Response.json` is fine for the demo (short replies + the page
  already shows a "thinking…" state). For token-by-token, switch the handler to
  `client.messages.stream(...)` and read the stream in `app/ai/page.tsx`.
- This is still "no backend" in the product sense — one serverless function
  colocated in the app, the standard Next.js pattern; no DB, no auth server.
