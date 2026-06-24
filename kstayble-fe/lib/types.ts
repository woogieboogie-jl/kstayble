// K-Tour ID domain model.
// Mirrors the product spec in docs/ (PDF): identity → K-Pass Capsule (VC)
// → KRW stablecoin wallet → services → OmniOne Chain event log → AI benefits.

/** 내국인 / 외국인 관광객 / 장기체류 외국인 */
export type UserType = "korean" | "foreigner" | "long-term"

export type IdentityMethod = "mobile-id" | "passport-did" | "foreigner-id"

export interface Identity {
  method: IdentityMethod
  displayName: string
  nationality: string
  nationalityFlag: string
  /** portrait lifted from the ID, confirmed by the user, carried onto the K-Pass */
  photoUrl?: string
  verified: boolean
  /** Open DID identifier (did:omn:...) */
  did: string
}

export type ServiceKey = "transport" | "shopping" | "delivery" | "reservation" | "benefit"

export type TrustLevel = "basic" | "verified" | "premium"

/**
 * K-Pass Capsule — the digital tourism resident pass issued as a Verifiable
 * Credential. Identity source differs (Mobile ID vs Passport DID) but the
 * service permission set is standardised here.
 */
export interface KPassCapsule {
  id: string
  holderName: string
  userType: UserType
  did: string
  issuedAt: string
  expiresAt: string
  /** 체류기간 e.g. "90 days" */
  stayPeriod: string
  /** 결제한도 (KRW) */
  paymentLimitKRW: number
  trustLevel: TrustLevel
  /** 사용 가능 서비스 */
  services: ServiceKey[]
  /** 혜택권 */
  benefits: string[]
}

export interface Wallet {
  address: string
  balanceKRW: number
  /** approximate KRW per 1 USD, used for the tourist-facing USD readout */
  usdRate: number
  provider: "k-stayble" | "external"
  connected: boolean
}

export type ChainEventType =
  | "KPassIssued"
  | "WalletLinked"
  | "PaymentAuthorized"
  | "VoucherIssued"
  | "VoucherRedeemed"
  | "PartnerSettlementLogged"

export interface ChainEvent {
  id: string
  type: ChainEventType
  txHash: string
  timestamp: string
  summary: string
}

export interface Transaction {
  id: string
  merchant: string
  /** partner brand key (lib/brands) for a real logo avatar; falls back to `icon` */
  brand?: string
  category: ServiceKey | "topup"
  /** negative = spend, positive = top-up/receive (KRW) */
  amountKRW: number
  date: string
  /** emoji fallback when no logo asset */
  icon: string
  iconBg: string
  chainEvent: ChainEventType
  txHash: string
}

export type ServiceCategory = "food" | "shopping" | "medical"

export interface ServiceItem {
  id: string
  category: ServiceCategory
  name: string
  location: string
  priceKRW: number
  etaLabel: string
  rating: number
  image: string
  partner?: string
  url?: string
}

export interface BenefitOffer {
  id: string
  title: string
  detail: string
  kind: "coupon" | "nft" | "cashback" | "tour"
  valueLabel: string
  /** AI Benefit Router rationale shown to the user */
  reason: string
  icon: string
}

export interface AppNotification {
  id: number
  type: "transaction" | "promotion" | "security" | "system"
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  iconBg: string
}

// ---- Verified Connect (social / activities among DID-verified users) -------

export type ActivityCategory = "food" | "tour" | "language" | "play"

export interface Activity {
  id: string
  category: ActivityCategory
  title: string
  titleEn?: string
  host: string
  hostFlag: string
  hostPhoto: string
  hostType: UserType
  trustLevel: TrustLevel
  place: string
  placeEn?: string
  time: string
  timeEn?: string
  capacity: number
  joined: number
  participants: string[]
  costKRW?: number
}

export type ConnectRole = "guide" | "buddy" | "tutor"

export interface Peer {
  id: string
  name: string
  flag: string
  photo: string
  userType: UserType
  trustLevel: TrustLevel
  role: ConnectRole
  bio: string
  bioEn?: string
  langs: string[]
}

export interface ConnectMessage {
  id: string
  fromMe: boolean
  text: string
  textEn?: string
  time: string
  timeEn?: string
}

/** Full session held by the AppProvider. */
export interface Session {
  onboarded: boolean
  userType: UserType | null
  identity: Identity | null
  capsule: KPassCapsule | null
  wallet: Wallet
}
