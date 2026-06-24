// Mock implementations of the service contracts (DEMO_MODE).
// `fakeHash` is counter-salted, so it is unique per call (NOT a pure function of
// its seed). That's fine: it only runs inside async client event handlers, never
// during SSR/render, so there is no hydration concern.

import type {
  BenefitOffer,
  ChainEvent,
  ChainEventType,
  Identity,
  IdentityMethod,
  KPassCapsule,
  ServiceKey,
  UserType,
  Wallet,
} from "@/lib/types"
import type {
  BenefitService,
  CapsuleService,
  ChainService,
  IdentityService,
  WalletService,
} from "./interfaces"
import { BENEFIT_OFFERS } from "@/lib/mock-data"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let seedCounter = 1
export function fakeHash(seed: string): string {
  let h = 2166136261 >>> 0
  const s = `${seed}:${seedCounter++}`
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  let out = ""
  let x = h || 1
  while (out.length < 64) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0
    out += x.toString(16).padStart(8, "0")
  }
  return "0x" + out.slice(0, 64)
}

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
function base58(hex: string): string {
  let num = BigInt("0x" + hex)
  let out = ""
  while (num > 0n) {
    out = B58[Number(num % 58n)] + out
    num /= 58n
  }
  return out
}
// Reads like a real Open DID (z-multibase base58), distinct from the kpass id
// (which is derived from a different hash slice — no shared bytes).
function fakeDid(seed: string): string {
  return `did:omn:z6Mk${base58(fakeHash("didkey:" + seed).slice(2)).slice(0, 40)}`
}

const NATIONALITY: Record<UserType, { label: string; flag: string }> = {
  korean: { label: "Republic of Korea", flag: "🇰🇷" },
  foreigner: { label: "United States", flag: "🇺🇸" },
  "long-term": { label: "Viet Nam", flag: "🇻🇳" },
}

export const mockIdentityService: IdentityService = {
  async verify(method: IdentityMethod, userType: UserType): Promise<Identity> {
    await delay(1400)
    const nat = NATIONALITY[userType]
    const displayName =
      userType === "korean" ? "김민준" : userType === "long-term" ? "Nguyen Van A" : "Peter Parker"
    return {
      method,
      displayName,
      nationality: nat.label,
      nationalityFlag: nat.flag,
      photoUrl:
        userType === "korean"
          ? "/portraits/minjun.jpg"
          : userType === "long-term"
            ? "/portraits/nguyen.jpg"
            : "/portraits/peter.jpg",
      verified: true,
      did: fakeDid(`${method}:${displayName}`),
    }
  },
}

const SERVICES_BY_TYPE: Record<UserType, ServiceKey[]> = {
  korean: ["transport", "shopping", "delivery", "reservation", "benefit"],
  foreigner: ["transport", "shopping", "delivery", "reservation", "benefit"],
  "long-term": ["transport", "shopping", "delivery", "benefit"],
}

export const mockCapsuleService: CapsuleService = {
  async issue(identity: Identity, userType: UserType): Promise<KPassCapsule> {
    await delay(1600)
    const now = new Date("2026-06-24T10:00:00+09:00")
    const expires = new Date(now)
    expires.setDate(expires.getDate() + 90)
    return {
      id: `kpass:${fakeHash(identity.did).slice(2, 14)}`,
      holderName: identity.displayName,
      userType,
      did: identity.did,
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      stayPeriod: userType === "korean" ? "Resident" : "90 days",
      paymentLimitKRW: userType === "long-term" ? 2_000_000 : 5_000_000,
      trustLevel: userType === "korean" ? "premium" : "verified",
      services: SERVICES_BY_TYPE[userType],
      benefits:
        userType === "korean"
          ? ["Local resident discounts", "Cultural coupon pack"]
          : ["Tourist VAT refund", "Transit pass", "Welcome coupon pack"],
    }
  },
}

const EXPLORER_BASE = "https://scan.omnione.net/tx"

export const mockChainService: ChainService = {
  async log(type: ChainEventType, summary: string): Promise<ChainEvent> {
    await delay(600)
    return {
      id: `evt:${fakeHash(type + summary).slice(2, 12)}`,
      type,
      txHash: fakeHash(type + summary),
      timestamp: new Date("2026-06-24T10:00:00+09:00").toISOString(),
      summary,
    }
  },
  explorerUrl(txHash: string): string {
    return `${EXPLORER_BASE}/${txHash}`
  },
}

export const mockWalletService: WalletService = {
  async create(holderName: string): Promise<Wallet> {
    await delay(600)
    return {
      address: fakeHash(`wallet:${holderName}`).slice(0, 42),
      balanceKRW: 1_520_768,
      usdRate: 1381.7,
      provider: "k-tour-id",
      connected: true,
    }
  },
  async topUp(wallet: Wallet, amountKRW: number): Promise<Wallet> {
    await delay(1200)
    return { ...wallet, balanceKRW: wallet.balanceKRW + amountKRW }
  },
}

export const mockBenefitService: BenefitService = {
  async recommend(): Promise<BenefitOffer[]> {
    await delay(500)
    return BENEFIT_OFFERS
  },
  async chat(message: string): Promise<string> {
    await delay(700)
    const m = message.toLowerCase()
    const ko = /[가-힣]/.test(message)
    const food = m.includes("food") || m.includes("eat") || m.includes("배달") || m.includes("맛집") || m.includes("먹")
    const transit = m.includes("transport") || m.includes("subway") || m.includes("t-money") || m.includes("교통") || m.includes("지하철")
    const benefit = m.includes("coupon") || m.includes("benefit") || m.includes("혜택") || m.includes("쿠폰") || m.includes("남은")
    if (food)
      return ko
        ? "오늘은 서대문 후라이드 치킨 추천드려요 (₩65,000, ★4.9). K-Tour ID로 결제하면 배민 제휴 10% 쿠폰이 붙어요. 적용해 드릴까요?"
        : "For tonight I'd suggest Korean fried chicken in Seodaemun (₩65,000, ★4.9). Paying with K-Tour ID gives you a 10% Baemin partner coupon. Want me to apply it?"
    if (transit)
      return ko
        ? "K-Pass 캡슐에 이미 T-money가 연동돼 있어요. 지하철 개찰구에 폰을 태그하면 원화 잔액에서 차감되고, 출국 시 남은 잔액은 교통 바우처로 전환돼요."
        : "Your K-Pass Capsule already covers T-money. Tap your phone at any subway gate — fares are deducted from your KRW balance, and unused balance converts to a transit voucher when you leave."
    if (benefit)
      return ko
        ? "잔액 ₩1.52M, 체류 12일 남았어요. 예상 잔여분(~₩180,000)을 올리브영·박물관 쿠폰으로 전환해 낭비 없게 해드릴 수 있어요. 설정할까요?"
        : "You have ₩1.52M and 12 days left. I can convert your projected leftover (~₩180,000) into Olive Young + museum coupons so nothing goes to waste. Shall I set that up?"
    return ko
      ? "저는 K-Tour ID 가이드예요. 음식·교통·쇼핑·의료, 또는 남은 원화를 쿠폰·체험 NFT로 바꾸는 방법까지 무엇이든 물어보세요."
      : "I'm your K-Tour ID guide. Ask me about food, transport, shopping, medical, or how to turn your leftover KRW into coupons and experience NFTs."
  },
}
