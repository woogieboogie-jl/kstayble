// Service contracts. Today these are backed by mock implementations; for the
// finals demo (9/30) we add OmniOne / Open DID adapters that implement the SAME
// interfaces and switch them in `index.ts` — screens never change.

import type {
  BenefitOffer,
  ChainEvent,
  ChainEventType,
  Identity,
  IdentityMethod,
  KPassCapsule,
  UserType,
  Wallet,
} from "@/lib/types"

export interface IdentityService {
  /** Mobile ID / OmniOne CX for Koreans, Passport+eKYC for foreigners. */
  verify(method: IdentityMethod, userType: UserType): Promise<Identity>
}

export interface CapsuleService {
  /** Issue the K-Pass Capsule as an Open DID Verifiable Credential. */
  issue(identity: Identity, userType: UserType): Promise<KPassCapsule>
}

export interface ChainService {
  /** Append a hashed event to the OmniOne Chain event log. */
  log(type: ChainEventType, summary: string): Promise<ChainEvent>
  explorerUrl(txHash: string): string
}

export interface WalletService {
  create(holderName: string): Promise<Wallet>
  topUp(wallet: Wallet, amountKRW: number): Promise<Wallet>
}

export interface BenefitService {
  /** AI Benefit Router: personalised recommendations. */
  recommend(ctx: { balanceKRW: number; userType: UserType | null }): Promise<BenefitOffer[]>
  /** Mini curation chatbot. */
  chat(message: string): Promise<string>
}
