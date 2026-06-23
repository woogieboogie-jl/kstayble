"use client"

import { useEffect, useRef, useState } from "react"
import { Send, ShieldCheck, BadgeCheck, Receipt } from "lucide-react"
import { PhoneFrame, PageHeader } from "@/components/app/shell"
import { useApp } from "@/lib/store/app-provider"
import { useLang } from "@/lib/i18n/lang-provider"
import { formatWon } from "@/lib/format"
import { CONNECT_MESSAGES } from "@/lib/mock-data"
import type { ConnectMessage } from "@/lib/types"

const HOST_PHOTO = "/portraits/minjun.jpg"
const SPLIT_KRW = 18000

export default function ConnectChatPage() {
  const { pay } = useApp()
  const { t, lang } = useLang()
  const [title, setTitle] = useState("김민준")
  const [rich, setRich] = useState(true)
  const [messages, setMessages] = useState<ConnectMessage[]>(CONNECT_MESSAGES)
  const [input, setInput] = useState("")
  const [paid, setPaid] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  // entry context: tapping a different host/peer gives a coherent header + thread
  useEffect(() => {
    const w = new URLSearchParams(window.location.search).get("with")
    if (w && w !== "김민준") {
      const ko = document.documentElement.lang !== "en"
      setTitle(w)
      setRich(false)
      setMessages([
        { id: "g1", fromMe: false, text: ko ? "안녕하세요! K-Stayble에서 연결됐네요 🙂" : "Hi! Nice to connect on K-Stayble 🙂", time: ko ? "오후 5:01" : "5:01 PM" },
        { id: "g2", fromMe: true, text: ko ? "반가워요! 같이 하고 싶어서 연락드려요." : "Hi! I'd love to join you.", time: ko ? "오후 5:02" : "5:02 PM" },
        { id: "g3", fromMe: false, text: ko ? "좋아요 — 검증된 분이라 안심돼요. 언제 편하세요?" : "Great — you're verified, so I feel safe. When works for you?", time: ko ? "오후 5:03" : "5:03 PM" },
      ])
    }
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }))
  }, [messages.length])

  const push = (m: Omit<ConnectMessage, "id" | "time">) =>
    setMessages((cur) => [...cur, { ...m, id: `m-${cur.length + 1}`, time: lang === "ko" ? "지금" : "now" }])

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    setInput("")
    push({ fromMe: true, text: q })
    setTimeout(() => push({ fromMe: false, text: lang === "ko" ? "좋아요! 그때 봬요 🙂" : "Great — see you then! 🙂" }), 800)
  }

  const splitPay = async () => {
    if (paid) return
    setPaid(true)
    push({ fromMe: true, text: lang === "ko" ? `같이 결제 ${formatWon(SPLIT_KRW)} 완료 ✓` : `Split pay ₩${SPLIT_KRW.toLocaleString("en-US")} done ✓` })
    await pay("한강 치맥 (1/n)", SPLIT_KRW, "delivery")
    setTimeout(() => push({ fromMe: false, text: lang === "ko" ? "확인했어요! OmniOne 체인에 기록됐어요 🙆" : "Got it — logged on the OmniOne Chain 🙆" }), 700)
  }

  return (
    <PhoneFrame>
      <PageHeader
        title={title}
        back="/connect"
        right={
          <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
          </span>
        }
      />

      {/* safety banner */}
      <div className="mx-5 mb-3 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-[11px] text-muted-foreground ring-1 ring-border">
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
        {t("connect.chat.safety")}
      </div>

      <div className="space-y-3 px-5 pb-2">
        {messages.map((m) => (
          <div key={m.id} className={m.fromMe ? "flex justify-end" : "flex items-end gap-2"}>
            {!m.fromMe && <img src={HOST_PHOTO} alt="" className="h-7 w-7 flex-shrink-0 rounded-full object-cover" />}
            <div className="max-w-[78%]">
              <div
                className={
                  m.fromMe
                    ? "rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-[13px] text-white"
                    : "rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2.5 text-[13px] text-foreground ring-1 ring-border"
                }
              >
                {m.text}
              </div>
              <p className={cnTime(m.fromMe)}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* split-pay action (only for the 한강 치맥 host room) */}
      {rich && (
        <div className="px-5 pb-2">
          <button
            type="button"
            onClick={splitPay}
            disabled={paid}
            className="pressable flex w-full items-center justify-center gap-2 rounded-xl bg-surface-2 py-2.5 text-[12px] font-semibold text-foreground ring-1 ring-border disabled:opacity-50"
          >
            <Receipt className="h-3.5 w-3.5 text-primary" />
            {paid
              ? lang === "ko" ? "결제 완료 · OmniOne 기록됨" : "Paid · logged on OmniOne"
              : `${t("connect.split")} · ${lang === "ko" ? formatWon(SPLIT_KRW) : `₩${SPLIT_KRW.toLocaleString("en-US")}`}`}
          </button>
        </div>
      )}

      {/* input */}
      <div className="sticky bottom-0 bg-card px-5 pb-4 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("connect.chat.placeholder")}
            className="flex-1 rounded-full bg-surface-2 px-4 py-2.5 text-[13px] outline-none ring-1 ring-border focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-brand-gradient pressable grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-white disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </PhoneFrame>
  )
}

function cnTime(fromMe: boolean) {
  return `mt-0.5 text-[10px] text-muted-foreground ${fromMe ? "text-right" : ""}`
}
