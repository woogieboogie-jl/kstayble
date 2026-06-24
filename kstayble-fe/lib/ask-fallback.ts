// Client-side fallback for /ask when no live LLM key is configured (or the API
// errors). Curated, accurate answers (KO + EN) so the "ask the AI" URL always
// responds. Wording mirrors the honest demo-vs-finals story.

export interface Faq {
  keys: string[]
  a: string
  aEn: string
}

export const ASK_SUGGESTIONS = [
  "K-Tour ID이 뭐예요?",
  "모바일 신분증·여권은 어떻게 쓰여요?",
  "DID랑 VC(K-Pass) 차이는?",
  "가맹점은 뭘 검증하나요?",
  "온체인엔 뭐가 올라가나요?",
  "AI는 뭘 해주나요?",
  "결선엔 뭐가 바뀌나요?",
]

export const ASK_FAQ: Faq[] = [
  {
    keys: ["뭐예요", "뭔가요", "뭐하는", "소개", "프로젝트", "what is", "what's", "kstayble", "k-stayble", "about"],
    a: "K-Tour ID은 AI 기반 '관광 신뢰 지갑'입니다. 내국인(모바일 신분증)·외국인 관광객(여권 DID)·장기체류 외국인 누구든 K-Pass Capsule(VC) 한 장을 발급받아, 신원 소스가 달라도 서비스 권한(체류·결제한도·자격·혜택)을 표준화합니다. 원화 스테이블 지갑으로 교통·식사·쇼핑을 결제하고, 모든 신뢰 이벤트는 OmniOne Chain에 기록되며, AI가 남은 원화를 쿠폰으로 전환합니다.",
    aEn: "K-Tour ID is an AI 'tourist trust wallet.' Korean residents (Mobile ID), foreign tourists (Passport DID) and long-stay foreigners each get one K-Pass Capsule (a VC), so a different identity source still standardizes into the same service permissions (stay, payment limit, eligibility, benefits). You pay for transit/food/shopping from a KRW-stablecoin wallet, every trust event is logged on the OmniOne Chain, and the AI turns leftover KRW into coupons.",
  },
  {
    keys: ["모바일 신분증", "mobile id", "신분증", "내국인", "resident", "여권", "passport", "ekyc", "본인확인", "외국인등록증", "arc"],
    a: "본인확인은 유형별로 다른 소스를 쓰되 K-Pass 한 장으로 표준화됩니다. 내국인은 정부 모바일 신분증(필수 요소), 외국인 관광객은 여권 + eKYC로 관광 DID 생성(한국 전화번호 불필요), 장기체류 외국인은 외국인등록증 — 모두 같은 IdentityService 인터페이스(결선엔 OmniOne CX)로 들어옵니다.",
    aEn: "Identity proofing uses a different source per user type but standardizes into one K-Pass: Korean residents use the government Mobile ID (the mandatory element), foreign tourists use passport + eKYC to mint a tourist DID (no Korean phone number needed), and long-stay foreigners use their alien registration card — all via the same IdentityService interface (OmniOne CX in the finals).",
  },
  {
    keys: ["did", "vc", "차이", "difference", "다른", "verifiable credential", "캡슐", "capsule"],
    a: "DID는 '식별자 + 키'입니다(OmniOne DID). DID Document(공개키)로 resolve되며 '이 신원이 존재하고 서명을 검증할 수 있다'만 말합니다. VC(K-Pass Capsule)는 발급자가 서명한 '증명서'로, 소지자 DID에 대해 체류기간·결제한도·신뢰등급을 보증합니다. 즉 DID=신원 앵커, VC=그 위에 얹은 서명된 자격증명입니다.",
    aEn: "A DID is an identifier + keys (OmniOne DID) that resolves to a DID Document (public keys) — it only says 'this identity exists and you can verify its signatures.' A VC (the K-Pass Capsule) is a credential signed by an issuer that attests claims (stay period, payment limit, trust level) about the holder's DID. So DID = identity anchor, VC = signed claims on top of it.",
  },
  {
    keys: ["가맹점", "vp", "검증", "verify", "면세", "presentation", "merchant", "verifier", "tax"],
    a: "가맹점은 VP(Verifiable Presentation)만 받아 PII 없이 4가지를 검증합니다: ① 발급자 서명 진위(발급자 DID·키를 체인에서 resolve, 중앙DB 불필요) ② 소지자 본인성(VP가 소지자 키로 서명됨) ③ 유효·미폐기·미만료 ④ 필요한 자격만(예: 외국인 관광객, 면세 자격, 쿠폰 미사용, 19세 이상). 예: 면세점은 '검증된 외국인 관광객 + 체류 유효'만 확인하고 여권번호·이름은 받지 않습니다. (가맹점 VP 검증 자체는 결선에서 OmniOne으로 붙습니다.)",
    aEn: "A merchant receives only a VP (Verifiable Presentation) and verifies four things without any PII: (1) issuer signature authenticity (resolve the issuer DID/key on-chain — no central DB), (2) holder binding (VP signed by the holder's key), (3) validity / not-revoked / not-expired, (4) just the needed claim (e.g., foreign tourist, tax-free eligible, coupon unused, age ≥ 19). A duty-free shop confirms 'verified foreign tourist + stay valid' without ever seeing the passport number or name. (Merchant-side VP verification itself lands in the finals via OmniOne.)",
  },
  {
    keys: ["온체인", "오프체인", "on-chain", "off-chain", "프라이버시", "privacy", "해시", "hash", "개인정보", "pii"],
    a: "온체인(OmniOne Chain)엔 이벤트 해시만 올라갑니다. 데모에서 발생하는 이벤트는 KPassIssued · WalletLinked · PaymentAuthorized · VoucherIssued · VoucherRedeemed 이고, PartnerSettlementLogged(정산)는 결선용으로 정의만 돼 있어요. DID·공개키 레지스트리·폐기 상태는 Open DID 인프라로 결선에 연동됩니다. 여권번호·개인정보·결제 원문 같은 PII는 절대 온체인에 안 쓰고 기기/발급자에 오프체인 보관합니다(Privacy Edge). 그래서 국적·체류기간·쿠폰 자격을 원문 없이 증명합니다.",
    aEn: "Only event hashes go on-chain (OmniOne Chain). The demo emits KPassIssued, WalletLinked, PaymentAuthorized, VoucherIssued and VoucherRedeemed; PartnerSettlementLogged is defined for the finals only. The DID/key registry and revocation status are Open DID infrastructure, wired at the finals. PII — passport number, personal data, payment originals — is never written on-chain; it stays off-chain on the device/issuer (Privacy Edge), so nationality, stay period and coupon eligibility are proven without revealing the originals.",
  },
  {
    keys: ["폐기", "revocation", "revoke", "취소", "만료", "분실", "비자", "expire", "lost", "visa"],
    a: "발급자가 OmniOne Chain의 폐기/상태 레지스트리에서 K-Pass를 무효화하면 가맹점 VP 검증이 즉시 실패하도록 설계돼 있어요. 가맹점은 발급자 문의·중앙 DB 조회 없이 온체인 상태만 확인하면 됩니다. 다만 데모엔 VP 검증·폐기 레지스트리가 아직 연결돼 있지 않고, 결선(9/30)에 OmniOne SDK 어댑터를 꽂을 때 실제로 동작합니다.",
    aEn: "By design, when the issuer revokes a K-Pass in OmniOne Chain's revocation/status registry, a merchant's VP check fails immediately — the merchant just checks the on-chain status, with no issuer call or central DB. Note this is not wired in the demo; VP verification and the revocation registry come online in the finals (Sep 30) when the OmniOne SDK adapters are plugged in.",
  },
  {
    keys: ["omnione", "솔루션", "라온", "raon", "cx", "open did", "opendid", "필수", "가점", "세개", "3개", "세 개", "solution", "mandatory", "bonus"],
    a: "세 가지가 코드 seam 3곳에 꽂힙니다. ① Mobile ID / OmniOne CX = 본인확인(필수 요소) → IdentityService.verify(). ② Open DID = K-Pass(VC) 발급·VP 검증·선택적 공개(가점 +5%) → CapsuleService.issue(). ③ OmniOne Chain = 이벤트 해시 기록(가점 +5%) → ChainService.log() — DID/키 레지스트리·폐기는 Open DID 인프라로 결선 연동. 데모는 이 자리에 mock을, 결선엔 실제 OmniOne SDK 어댑터를 교체만 합니다.",
    aEn: "Three pieces plug into three code seams: (1) Mobile ID / OmniOne CX = identity proofing (mandatory) → IdentityService.verify(); (2) Open DID = K-Pass (VC) issuance + VP verification + selective disclosure (+5% bonus) → CapsuleService.issue(); (3) OmniOne Chain = event-hash logging (+5% bonus) → ChainService.log() — the DID/key registry and revocation are Open DID infrastructure (finals). The demo plugs mocks into these seams; the finals just swap in the real OmniOne SDK adapters.",
  },
  {
    keys: ["ai", "에이아이", "혜택", "router", "benefit", "코파일럿", "copilot", "추천", "쿠폰", "남은", "leftover"],
    a: "AI Benefit Router가 체류·소비 맥락으로 혜택을 추천하고, 남은 원화를 쿠폰·교통 바우처로 전환해 낭비를 막아요. 화면마다 딱 맞는 행동(결제·충전·전환)을 한 번에 실행하는 앰비언트 코파일럿(信)으로 떠 있고, 모든 거래는 OmniOne 체인에 기록됩니다. 결선엔 이상거래 탐지도 추가됩니다.",
    aEn: "The AI Benefit Router recommends benefits from your stay/spending context and converts leftover KRW into coupons and transit vouchers so nothing is wasted. It rides along as an ambient copilot (信) that runs the right action per screen (pay/top-up/convert) in one tap, and every transaction is logged on the OmniOne Chain. Anomaly detection is added in the finals.",
  },
  {
    keys: ["스마트", "컨트랙트", "smart contract", "2-layer", "2레이어", "레이어", "layer", "evm", "프로그래머블", "programmable"],
    a: "우리 제안에서 OmniOne Chain의 정의된 역할은 이벤트 해시 앵커예요. DID/키 레지스트리·폐기·발급자 trust registry는 Open DID 인프라로 결선에 연동됩니다. '프로그래머블 머니'(스테이블코인 결제·바우처·1/n 에스크로·정산)는 별도 EVM 컨트랙트 레이어예요. 레포의 forKRW·ForeignerSBT는 머니 레이어 개념의 초기 실험으로 제출 제안서 범위 밖이에요. 중요한 점: OmniOne Chain은 Hyperledger Besu 기반(EVM 호환)이라 스마트컨트랙트를 실제로 실행해요(DID 문서를 컨트랙트로 관리) — 못 해서가 아니라 설계상 머니 컨트랙트만 별도 EVM/L2에 둡니다. K-Pass(VC)가 두 레이어를 잇습니다.",
    aEn: "In our proposal, OmniOne Chain's defined role is the event-hash anchor; the DID/key registry, revocation and issuer trust registry are Open DID infrastructure (finals). 'Programmable money' (stablecoin payments, vouchers, 1/n split escrow, settlement) is a separate EVM-contract layer. The repo's forKRW + ForeignerSBT are an early experiment of that money layer, beyond the submitted proposal's scope. Important: OmniOne Chain is a Hyperledger Besu (EVM-compatible) ledger that actually runs smart contracts (it manages DID documents via contract code) — we keep money contracts on a separate EVM/L2 by design choice, not because it can't run them. The K-Pass (VC) bridges the two layers.",
  },
  {
    keys: ["zkp", "영지식", "zero", "선택적", "selective", "bbs", "unlink"],
    a: "Privacy Edge는 'Selective Disclosure · ZKP-ready'로 설계됐어요(PDF 표기). 값을 안 까고 술어만 증명(나이≥19, 체류>0)하거나 고른 속성만 공개하고, ZKP-friendly 서명(예: BBS+)은 비연결성도 지향할 수 있어요. 다만 OmniOne이 BBS+/ZKP를 기본 제공하는지는 공개 문서로 미확정이라 단정하지 않고, 구체 스킴은 표준 라이브러리로 결선에 붙이는 걸 목표로 합니다. 데모엔 실제 ZKP 연산은 아직 없어요.",
    aEn: "Privacy Edge is designed as 'Selective Disclosure · ZKP-ready' (the PDF's term). The holder can reveal only chosen attributes or prove a predicate (age ≥ 19, stay > 0) without originals, and ZKP-friendly signatures (e.g., BBS+) can target unlinkability. We don't assert OmniOne ships BBS+/ZKP (unconfirmed in public docs); the specific scheme is a finals goal via standard libraries. The demo doesn't run real ZKP yet.",
  },
  {
    keys: ["결선", "로드맵", "roadmap", "finals", "real", "실제", "다음", "9/30", "프로덕션", "production"],
    a: "지금은 Phase-0 클릭 데모예요(서비스가 인터페이스 뒤에 mock). 결선(9/30)엔 화면 변경 없이 실제 어댑터를 끼웁니다: 실제 Mobile ID/여권 eKYC, Open DID VC 발급, OmniOne Chain 기록+폐기, KRW 스테이블코인 정산, 가맹점 VP 검증+정산 대시보드, ZKP 선택적 공개, AI 이상탐지.",
    aEn: "Right now it's a Phase-0 clickable demo (services mocked behind interfaces). For the finals (Sep 30) the real adapters drop in with no screen changes: real Mobile ID / passport eKYC, Open DID VC issuance, OmniOne Chain logging + revocation, KRW-stablecoin settlement, merchant-side VP verification + settlement dashboard, ZKP selective disclosure, and AI anomaly detection.",
  },
  {
    keys: ["기술", "스택", "stack", "tech", "어떻게 만들", "구현", "build", "nextjs"],
    a: "Next.js 16(App Router) · React 19 · Tailwind v4 · TypeScript. 서비스는 인터페이스+mock으로 분리(lib/services, DEMO_MODE)해 결선에 OmniOne/Open DID/결제 어댑터를 한 줄로 교체합니다. 디자인은 한국 헤리티지(한지·먹·인주 도장·단청) 랭귀지입니다.",
    aEn: "Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript. Services are split behind interfaces + mocks (lib/services, DEMO_MODE) so the OmniOne / Open DID / payment adapters swap in for the finals with a one-line change. The design uses a Korean-heritage language (hanji paper, ink, dojang seal-red, dancheong).",
  },
]

function isEnglish(q: string): boolean {
  return !/[가-힣]/.test(q) && /[a-z]/i.test(q)
}

// latin/number keys match on a word boundary (so "ai" doesn't fire inside
// "explain"); Korean keys match as a substring.
function hit(q: string, key: string): boolean {
  const k = key.toLowerCase()
  if (/^[a-z0-9/+-]+$/.test(k)) {
    const esc = k.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    return new RegExp(`(^|[^a-z0-9])${esc}([^a-z0-9]|$)`, "i").test(q)
  }
  return q.includes(k)
}

// greetings / thanks at the start of the message → a warm, non-question reply
const GREETING = /^\s*(안녕|안뇽|하이|하잉|ㅎㅇ|반가|여보세요|hi|hello|hey|good\s?(morning|afternoon|evening)|고마|감사|thank|thx)/i

export function matchFaq(question: string): string {
  const q = question.toLowerCase()
  const en = isEnglish(question)
  if (GREETING.test(question.trim())) {
    return en
      ? "Hi! I'm the K-Tour ID technical assistant. Ask me about the architecture (OmniOne · Open DID · OmniOne Chain), DID vs VC, merchant VP verification, on-chain privacy, revocation, ZKP, or what changes for the finals."
      : "안녕하세요! K-Tour ID 기술 어시스턴트예요. 아키텍처(OmniOne · Open DID · OmniOne Chain), DID/VC 차이, 가맹점 VP 검증, 온체인 프라이버시, 폐기, ZKP, 데모→결선 계획 등 무엇이든 편하게 물어보세요."
  }
  let best: { score: number; f: Faq } | null = null
  for (const f of ASK_FAQ) {
    const score = f.keys.reduce((s, k) => (hit(q, k) ? s + 1 : s), 0)
    if (score > 0 && (!best || score > best.score)) best = { score, f }
  }
  if (best) return en ? best.f.aEn : best.f.a
  return en
    ? "I'm the K-Tour ID technical assistant. Try asking about on-chain privacy (hash-only), DID vs VC, merchant VP verification, revocation, ZKP, the 2-layer architecture, or what changes for the finals."
    : "저는 K-Tour ID 기술 어시스턴트예요. 온체인 프라이버시(해시만), DID/VC 차이, 가맹점 VP 검증, 폐기, ZKP, 2-레이어 아키텍처, 결선 변경점 등을 물어봐 주세요."
}
