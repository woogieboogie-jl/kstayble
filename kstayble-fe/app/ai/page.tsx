"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { PhoneFrame, PageHeader, SectionTitle } from "@/components/app/shell"
import { useApp } from "@/lib/store/app-provider"
import { useLang } from "@/lib/i18n/lang-provider"
import { AppIcon, type IconKey } from "@/lib/icon-map"
import type { BenefitOffer } from "@/lib/types"

interface ChatMsg {
  role: "user" | "ai"
  text: string
}

export default function AiPage() {
  const { chat, recommendBenefits } = useApp()
  const { t } = useLang()
  const [offers, setOffers] = useState<BenefitOffer[]>([])
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    recommendBenefits().then(setOffers)
  }, [recommendBenefits])

  // seed greeting in the active language (once)
  useEffect(() => {
    setMessages([{ role: "ai", text: t("ai.greeting") }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const suggestions = [t("ai.s1"), t("ai.s2"), t("ai.s3")]

  const send = async (text: string) => {
    const q = text.trim()
    if (!q || thinking) return
    setInput("")
    setMessages((m) => [...m, { role: "user", text: q }])
    setThinking(true)
    const reply = await chat(q)
    setMessages((m) => [...m, { role: "ai", text: reply }])
    setThinking(false)
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }))
  }

  return (
    <PhoneFrame>
      <PageHeader title={t("ai.title")} />

      <div className="space-y-6 px-5 pt-1">
        <div className="bg-brand-gradient shadow-card-hero relative overflow-hidden rounded-3xl p-5 text-white">
          <div className="relative flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[15px] font-bold">{t("ai.router")}</p>
              <p className="text-[12px] text-white/75">{t("ai.routerSub")}</p>
            </div>
          </div>
        </div>

        <div>
          <SectionTitle>{t("ai.recommended")}</SectionTitle>
          <div className="space-y-2.5">
            {offers.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3.5 ring-1 ring-border">
                    <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-xl bg-secondary" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
                      <div className="h-2.5 w-1/2 animate-pulse rounded bg-secondary" />
                    </div>
                  </div>
                ))
              : offers.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-[0_2px_14px_rgba(20,22,30,0.06)] ring-1 ring-border">
                    <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                      <AppIcon name={b.icon as IconKey} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[13px] font-semibold text-foreground">{b.title}</p>
                        <span className="flex-shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {b.valueLabel}
                        </span>
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">{b.detail}</p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Sparkles className="h-2.5 w-2.5 text-primary" /> {b.reason}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        <div>
          <SectionTitle>{t("ai.ask")}</SectionTitle>
          <div className="flex flex-col rounded-3xl bg-surface-2 ring-1 ring-border">
            <div className="max-h-[260px] space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[78%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-[13px] text-white"
                        : "max-w-[82%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[13px] text-foreground shadow-sm"
                    }
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[13px] text-muted-foreground shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("ai.thinking")}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="pressable flex-shrink-0 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-medium text-foreground/80 hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send(input)
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("ai.placeholder")}
                className="flex-1 rounded-full bg-white px-4 py-2.5 text-[13px] outline-none ring-1 ring-border focus:ring-primary"
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="bg-brand-gradient pressable grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-white disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}
