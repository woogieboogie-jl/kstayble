"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type {
  AppNotification,
  BenefitOffer,
  ChainEvent,
  Identity,
  IdentityMethod,
  KPassCapsule,
  Session,
  Transaction,
  UserType,
} from "@/lib/types"
import {
  benefitService,
  capsuleService,
  chainService,
  identityService,
  walletService,
} from "@/lib/services"
import {
  DEFAULT_EVENTS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SESSION,
  DEFAULT_TRANSACTIONS,
  GUEST_SESSION,
} from "@/lib/mock-data"

export interface ChatMsg {
  role: "user" | "ai"
  text: string
}

interface AppContextValue {
  session: Session
  transactions: Transaction[]
  events: ChainEvent[]
  notifications: AppNotification[]
  hydrated: boolean
  // onboarding
  reset: () => void
  verifyIdentity: (userType: UserType, method: IdentityMethod) => Promise<Identity>
  issueCapsule: (identity: Identity, userType: UserType) => Promise<KPassCapsule>
  // wallet
  topUp: (amountKRW: number) => Promise<void>
  pay: (merchant: string, amountKRW: number, category: Transaction["category"]) => Promise<void>
  /** convert leftover KRW into vouchers — logs VoucherRedeemed (NOT a payment) */
  convertLeftover: (amountKRW: number) => Promise<void>
  // notifications
  dismissNotification: (id: number) => void
  markAllRead: () => void
  // ai
  recommendBenefits: () => Promise<BenefitOffer[]>
  chat: (message: string) => Promise<string>
  // copilot (ambient AI)
  copilotOpen: boolean
  openCopilot: () => void
  closeCopilot: () => void
  copilotThread: ChatMsg[]
  copilotThinking: boolean
  copilotSeed: (greeting: string) => void
  copilotSend: (message: string) => Promise<void>
  copilotPushAi: (text: string) => void
  dismissedNudges: string[]
  dismissNudge: (key: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = "kstayble-state-v1"

interface PersistShape {
  session: Session
  transactions: Transaction[]
  events: ChainEvent[]
  notifications: AppNotification[]
  dismissedNudges: string[]
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(DEFAULT_SESSION)
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS)
  const [events, setEvents] = useState<ChainEvent[]>(DEFAULT_EVENTS)
  const [notifications, setNotifications] = useState<AppNotification[]>(DEFAULT_NOTIFICATIONS)
  const [dismissedNudges, setDismissedNudges] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  // copilot UI state (in-memory; survives route changes since provider is at root)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotThread, setCopilotThread] = useState<ChatMsg[]>([])
  const [copilotThinking, setCopilotThinking] = useState(false)

  const sessionRef = useRef(session)
  sessionRef.current = session

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistShape>
        if (parsed.session) setSession(parsed.session)
        if (parsed.transactions) setTransactions(parsed.transactions)
        if (parsed.events) setEvents(parsed.events)
        if (parsed.notifications) setNotifications(parsed.notifications)
        if (parsed.dismissedNudges) setDismissedNudges(parsed.dismissedNudges)
      }
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    const payload: PersistShape = { session, transactions, events, notifications, dismissedNudges }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* quota / unavailable */
    }
  }, [hydrated, session, transactions, events, notifications, dismissedNudges])

  const reset = useCallback(() => {
    setSession(GUEST_SESSION)
    setTransactions([])
    setEvents([])
    setNotifications([])
    setDismissedNudges([])
    setCopilotThread([])
    setCopilotOpen(false)
  }, [])

  const verifyIdentity = useCallback(async (userType: UserType, method: IdentityMethod) => {
    const identity = await identityService.verify(method, userType)
    setSession((s) => ({ ...s, userType, identity }))
    return identity
  }, [])

  const issueCapsule = useCallback(async (identity: Identity, userType: UserType) => {
    const capsule = await capsuleService.issue(identity, userType)
    const issuedEvent = await chainService.log(
      "KPassIssued",
      `K-Pass Capsule issued for ${capsule.holderName} (${userType})`,
    )
    const wallet = await walletService.create(capsule.holderName)
    const linkedEvent = await chainService.log("WalletLinked", "KRW stable wallet linked to K-Pass Capsule")

    setSession((s) => ({ ...s, onboarded: true, userType, identity, capsule, wallet }))
    setEvents((e) => [issuedEvent, linkedEvent, ...e])
    return capsule
  }, [])

  const topUp = useCallback(async (amountKRW: number) => {
    const updated = await walletService.topUp(sessionRef.current.wallet, amountKRW)
    const evt = await chainService.log("VoucherIssued", `Top-up of ₩${amountKRW.toLocaleString()} authorised`)
    setSession((s) => ({ ...s, wallet: updated }))
    setTransactions((t) => [
      {
        id: `tx-${evt.id}`,
        merchant: "Top up",
        category: "topup",
        amountKRW,
        date: new Date().toISOString(),
        icon: "topup",
        iconBg: "#f3ece0",
        chainEvent: "VoucherIssued",
        txHash: evt.txHash,
      },
      ...t,
    ])
    setEvents((e) => [evt, ...e])
  }, [])

  const pay = useCallback(
    async (merchant: string, amountKRW: number, category: Transaction["category"]) => {
      const evt = await chainService.log(
        "PaymentAuthorized",
        `Payment of ₩${amountKRW.toLocaleString()} to ${merchant}`,
      )
      setSession((s) => ({
        ...s,
        wallet: { ...s.wallet, balanceKRW: Math.max(0, s.wallet.balanceKRW - Math.abs(amountKRW)) },
      }))
      setTransactions((t) => [
        {
          id: `tx-${evt.id}`,
          merchant,
          category,
          amountKRW: -Math.abs(amountKRW),
          date: new Date().toISOString(),
          icon: "card",
          iconBg: "#ece6da",
          chainEvent: "PaymentAuthorized",
          txHash: evt.txHash,
        },
        ...t,
      ])
      setEvents((e) => [evt, ...e])
    },
    [],
  )

  // Convert leftover KRW → vouchers. NOT a payment: logs VoucherRedeemed.
  const convertLeftover = useCallback(async (amountKRW: number) => {
    const evt = await chainService.log(
      "VoucherRedeemed",
      `Converted ₩${amountKRW.toLocaleString()} leftover to T-money + coupons`,
    )
    setSession((s) => ({
      ...s,
      wallet: { ...s.wallet, balanceKRW: Math.max(0, s.wallet.balanceKRW - Math.abs(amountKRW)) },
    }))
    setTransactions((t) => [
      {
        id: `tx-${evt.id}`,
        merchant: "Leftover → T-money + coupons",
        category: "benefit",
        amountKRW: -Math.abs(amountKRW),
        date: new Date().toISOString(),
        icon: "ticket",
        iconBg: "#e6f7f1",
        chainEvent: "VoucherRedeemed",
        txHash: evt.txHash,
      },
      ...t,
    ])
    setEvents((e) => [evt, ...e])
  }, [])

  const dismissNotification = useCallback((id: number) => {
    setNotifications((n) => n.filter((x) => x.id !== id))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, read: true })))
  }, [])

  const recommendBenefits = useCallback(
    () => benefitService.recommend({ balanceKRW: sessionRef.current.wallet.balanceKRW, userType: sessionRef.current.userType }),
    [],
  )

  const chat = useCallback((message: string) => benefitService.chat(message), [])

  // ── copilot ───────────────────────────────────────────────────────────────
  const openCopilot = useCallback(() => setCopilotOpen(true), [])
  const closeCopilot = useCallback(() => setCopilotOpen(false), [])
  const copilotSeed = useCallback((greeting: string) => {
    setCopilotThread((t) => (t.length ? t : [{ role: "ai", text: greeting }]))
  }, [])
  const copilotSend = useCallback(async (message: string) => {
    const q = message.trim()
    if (!q) return
    setCopilotThread((t) => [...t, { role: "user", text: q }])
    setCopilotThinking(true)
    try {
      const reply = await benefitService.chat(q)
      setCopilotThread((t) => [...t, { role: "ai", text: reply }])
    } finally {
      setCopilotThinking(false)
    }
  }, [])
  const copilotPushAi = useCallback((text: string) => {
    setCopilotThread((t) => [...t, { role: "ai", text }])
    setCopilotOpen(true)
  }, [])
  const dismissNudge = useCallback((key: string) => {
    setDismissedNudges((d) => (d.includes(key) ? d : [...d, key]))
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      session,
      transactions,
      events,
      notifications,
      hydrated,
      reset,
      verifyIdentity,
      issueCapsule,
      topUp,
      pay,
      convertLeftover,
      dismissNotification,
      markAllRead,
      recommendBenefits,
      chat,
      copilotOpen,
      openCopilot,
      closeCopilot,
      copilotThread,
      copilotThinking,
      copilotSeed,
      copilotSend,
      copilotPushAi,
      dismissedNudges,
      dismissNudge,
    }),
    [
      session, transactions, events, notifications, hydrated, reset, verifyIdentity, issueCapsule,
      topUp, pay, convertLeftover, dismissNotification, markAllRead, recommendBenefits, chat,
      copilotOpen, openCopilot, closeCopilot, copilotThread, copilotThinking, copilotSeed, copilotSend,
      copilotPushAi, dismissedNudges, dismissNudge,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within <AppProvider>")
  return ctx
}
