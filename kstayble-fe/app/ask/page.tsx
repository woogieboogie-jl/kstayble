"use client"

import { useEffect, useRef, useState } from "react"
import { Send, Loader2, ShieldCheck } from "lucide-react"
import { Seal } from "@/components/app/seal"
import { ASK_SUGGESTIONS, matchFaq } from "@/lib/ask-fallback"

interface Msg {
  role: "user" | "ai"
  text: string
}

const GREETING =
  "안녕하세요 — K-Stayble 기술 어시스턴트입니다. 개발팀이 아키텍처(OmniOne · Open DID · OmniOne Chain), DID/VC, 가맹점 VP 검증, 온체인 프라이버시, ZKP 등을 학습시켰어요. 무엇이든 물어보세요. (Ask me anything — I answer in your language.)"

export default function AskPage() {
  const [messages, setMessages] = useState<Msg[]>([{ role: "ai", text: GREETING }])
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }))
  }, [messages.length, busy])

  const ask = async (text: string) => {
    const q = text.trim()
    if (!q || busy) return
    setInput("")
    setMessages((m) => [...m, { role: "user", text: q }])
    setBusy(true)
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: q }),
      })
      if (res.ok) {
        const data = (await res.json()) as { reply?: string }
        const reply = (data.reply ?? "").trim() || matchFaq(q)
        setMessages((m) => [...m, { role: "ai", text: reply }])
      } else {
        // no key / upstream error → curated knowledge-base fallback
        setMessages((m) => [...m, { role: "ai", text: matchFaq(q) }])
      }
    } catch {
      setMessages((m) => [...m, { role: "ai", text: matchFaq(q) }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col px-5">
        {/* header */}
        <header className="flex items-center gap-3 pb-4 pt-8">
          <Seal size={44} />
          <div className="min-w-0">
            <h1 className="text-[20px] font-extrabold tracking-tight text-foreground">K-Stayble · 기술 Q&amp;A</h1>
            <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              개발팀이 학습시킨 AI 어시스턴트 · OmniOne / Open DID
            </p>
          </div>
        </header>

        {/* thread */}
        <div className="flex-1 space-y-3 overflow-y-auto py-2">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[82%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] leading-relaxed text-white"
                    : "max-w-[88%] whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-2xl rounded-bl-md bg-card px-4 py-3 text-[14px] leading-relaxed text-foreground ring-1 ring-border"
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-card px-4 py-3 text-[13px] text-muted-foreground ring-1 ring-border">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> 생각 중…
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* suggestion chips */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2 pt-1">
          {ASK_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              disabled={busy}
              className="pressable flex-shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground/80 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="sticky bottom-0 flex items-center gap-2 bg-background pb-6 pt-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="질문을 입력하세요 — 예: 온체인엔 뭐가 올라가요?"
            className="flex-1 rounded-full bg-card px-4 py-3 text-[14px] outline-none ring-1 ring-border focus:ring-primary"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="bg-brand-gradient pressable grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-white disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
