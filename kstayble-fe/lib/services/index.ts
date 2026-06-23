// Service wiring. The mock implementations power the demo; the `real*` stubs
// mark exactly where the OmniOne / Open DID / payment adapters plug in for the
// finals (Phase 1). DEMO_MODE picks which set is exported — screens never change.
//
// Switchable without a code edit: set NEXT_PUBLIC_DEMO_MODE=false to force the
// real adapters (which currently throw NotImplemented until Phase 1 lands).

import {
  mockBenefitService,
  mockCapsuleService,
  mockChainService,
  mockIdentityService,
  mockWalletService,
} from "./mock"
import type {
  BenefitService,
  CapsuleService,
  ChainService,
  IdentityService,
  WalletService,
} from "./interfaces"

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false"

const notImplemented = (name: string) => () => {
  throw new Error(`${name}: real OmniOne/OpenDID adapter not implemented yet (Phase 1).`)
}

// --- Phase 1 swap point: replace each stub with a real adapter ---------------
const realIdentityService: IdentityService = { verify: notImplemented("IdentityService.verify") }
const realCapsuleService: CapsuleService = { issue: notImplemented("CapsuleService.issue") }
const realChainService: ChainService = {
  log: notImplemented("ChainService.log"),
  explorerUrl: (txHash) => `https://scan.omnione.net/tx/${txHash}`,
}
const realWalletService: WalletService = {
  create: notImplemented("WalletService.create"),
  topUp: notImplemented("WalletService.topUp"),
}
const realBenefitService: BenefitService = {
  recommend: notImplemented("BenefitService.recommend"),
  // Posts to the server-side route handler (app/api/chat) so the key stays off
  // the client. Active only when DEMO_MODE is false (see docs/AI_INTEGRATION.md).
  async chat(message: string): Promise<string> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error("chat request failed")
    const data = (await res.json()) as { reply: string }
    return data.reply
  },
}

export const identityService = DEMO_MODE ? mockIdentityService : realIdentityService
export const capsuleService = DEMO_MODE ? mockCapsuleService : realCapsuleService
export const chainService = DEMO_MODE ? mockChainService : realChainService
export const walletService = DEMO_MODE ? mockWalletService : realWalletService
export const benefitService = DEMO_MODE ? mockBenefitService : realBenefitService

export type {
  IdentityService,
  CapsuleService,
  ChainService,
  WalletService,
  BenefitService,
} from "./interfaces"
