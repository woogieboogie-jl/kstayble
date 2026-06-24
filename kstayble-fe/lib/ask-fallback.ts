// Client-side fallback for /ask when no live LLM key is configured (or the API
// errors). Curated, accurate answers so the "ask the AI" URL always responds.

export interface Faq {
  keys: string[]
  a: string
}

export const ASK_SUGGESTIONS = [
  "온체인엔 뭐가 올라가나요?",
  "DID랑 VC(K-Pass) 차이가 뭐예요?",
  "가맹점은 뭘 검증하나요?",
  "K-Pass가 폐기되면 어떻게 되나요?",
  "OmniOne 솔루션 3개가 뭐예요?",
  "결선엔 뭐가 바뀌나요?",
]

export const ASK_FAQ: Faq[] = [
  {
    keys: ["온체인", "오프체인", "on-chain", "off-chain", "프라이버시", "privacy", "해시", "hash", "개인정보"],
    a: "온체인(OmniOne Chain)엔 이벤트 해시만 올라갑니다 — KPassIssued · WalletLinked · PaymentAuthorized · VoucherIssued · VoucherRedeemed · PartnerSettlementLogged. 그리고 DID·공개키 레지스트리와 폐기 상태가 체인에 있습니다. 여권번호·개인정보·결제 원문 같은 PII는 절대 온체인에 쓰지 않고 기기/발급자에 오프체인 보관합니다(Privacy Edge). 그래서 국적·체류기간·쿠폰 자격을 원문 없이 증명합니다.",
  },
  {
    keys: ["did", "vc", "차이", "difference", "다른", "verifiable credential", "캡슐", "capsule"],
    a: "DID는 '식별자 + 키'입니다(did:omn:…). DID Document(공개키)로 resolve되며 '이 신원이 존재하고 서명을 검증할 수 있다'만 말합니다. VC(K-Pass Capsule)는 발급자가 서명한 '증명서'로, 소지자 DID에 대해 체류기간·결제한도·신뢰등급 같은 속성을 보증합니다. 즉 DID=신원 앵커, VC=그 위에 얹은 서명된 자격증명입니다.",
  },
  {
    keys: ["가맹점", "vp", "검증", "verify", "면세", "presentation", "merchant", "verifier"],
    a: "가맹점은 VP(Verifiable Presentation)만 받아 PII 없이 4가지를 검증합니다: ① 발급자 서명 진위(발급자 DID·키를 체인에서 resolve, 중앙DB 불필요) ② 소지자 본인성(VP가 소지자 키로 서명됨) ③ 유효·미폐기·미만료 ④ 필요한 자격만(예: 외국인 관광객, 면세 자격, 쿠폰 미사용, 19세 이상). 예: 면세점은 '검증된 외국인 관광객 + 체류 유효'만 확인하고 여권번호·이름은 받지 않습니다.",
  },
  {
    keys: ["폐기", "revocation", "revoke", "취소", "만료", "분실", "비자"],
    a: "발급자가 OmniOne Chain의 폐기/상태 레지스트리에서 K-Pass를 무효화하면, 가맹점의 VP 검증이 즉시 실패합니다. 가맹점은 발급자에게 전화하거나 중앙 DB를 조회할 필요 없이 온체인 폐기 상태만 확인하면 됩니다. 비자 만료·분실·취소 시 실시간 무효화 — 신원 인프라로서 체인이 능동적으로 하는 핵심 역할입니다.",
  },
  {
    keys: ["omnione", "솔루션", "라온", "raon", "cx", "open did", "opendid", "필수", "가점", "세개", "3개", "세 개"],
    a: "세 가지가 코드 seam 3곳에 꽂힙니다. ① Mobile ID / OmniOne CX = 본인확인(필수) → IdentityService.verify(). ② Open DID = K-Pass(VC) 발급·VP 검증·선택적 공개(+5%) → CapsuleService.issue(). ③ OmniOne Chain = 이벤트 해시 기록 + DID/키 레지스트리 + 폐기(+5%) → ChainService.log(). 데모는 이 자리에 mock을, 결선엔 실제 OmniOne SDK 어댑터를 교체만 합니다.",
  },
  {
    keys: ["스마트", "컨트랙트", "smart contract", "2-layer", "2레이어", "레이어", "layer", "evm", "프로그래머블"],
    a: "체인은 '해시 로그'만 하는 게 아니라 신원 인프라(DID/키 레지스트리·폐기·발급자 trust registry)가 본진입니다. '프로그래머블 머니'(스테이블코인 결제·바우처·1/n 에스크로·정산·K-Pass SBT)는 별도 EVM 컨트랙트 레이어(레포의 forKRW + ForeignerSBT)에 둡니다. OmniOne Chain은 DID 목적 permissioned 원장이라 머니 컨트랙트는 EVM/L2에 — K-Pass(VC)가 두 레이어를 잇습니다.",
  },
  {
    keys: ["zkp", "영지식", "zero", "선택적", "selective", "bbs", "unlink"],
    a: "Open DID는 영지식 선택적 공개(BBS+ 서명)를 지원합니다. 소지자가 값을 안 까고 술어만 증명하거나(나이≥19, 체류>0) 고른 속성만 공개할 수 있고, 제시본이 비연결성(unlinkable)이라 가맹점들이 같은 사용자를 추적할 수 없습니다. 우리 Privacy Edge의 'ZKP-ready' 근거입니다.",
  },
  {
    keys: ["결선", "로드맵", "roadmap", "finals", "real", "실제", "다음", "9/30", "프로덕션"],
    a: "지금은 Phase-0 클릭 데모(서비스가 인터페이스 뒤에 mock). 결선(9/30)엔 화면 변경 없이 실제 어댑터를 끼웁니다: 실제 Mobile ID/여권 eKYC, Open DID VC 발급, OmniOne Chain 기록+폐기, KRW 스테이블코인 정산, 가맹점 VP 검증+정산 대시보드, ZKP 선택적 공개, AI 이상탐지.",
  },
  {
    keys: ["뭐", "무엇", "what is", "소개", "프로젝트", "kstayble", "k-stayble", "스테이블"],
    a: "K-Stayble은 AI 기반 '관광 신뢰 지갑'입니다. 내국인(모바일 신분증)·외국인 관광객(여권 DID)·장기체류 외국인 누구든 K-Pass Capsule(VC) 한 장을 발급받아, 신원 소스가 달라도 서비스 권한(체류·결제한도·자격·혜택)을 표준화합니다. 원화 스테이블 지갑으로 교통·식사·쇼핑을 결제하고, 모든 신뢰 이벤트는 OmniOne Chain에 기록되며, AI가 남은 원화를 쿠폰으로 전환합니다.",
  },
  {
    keys: ["기술", "스택", "stack", "next", "tech", "어떻게 만들", "구현"],
    a: "Next.js 16(App Router) · React 19 · Tailwind v4 · TypeScript. 서비스는 인터페이스+mock으로 분리(lib/services, DEMO_MODE)해 결선에 OmniOne/Open DID/결제 어댑터를 한 줄로 교체합니다. 디자인은 한국 헤리티지(한지·먹·인주 도장·단청) 랭귀지입니다.",
  },
]

export function matchFaq(question: string): string {
  const q = question.toLowerCase()
  let best: { score: number; a: string } | null = null
  for (const f of ASK_FAQ) {
    const score = f.keys.reduce((s, k) => (q.includes(k.toLowerCase()) ? s + 1 : s), 0)
    if (score > 0 && (!best || score > best.score)) best = { score, a: f.a }
  }
  return (
    best?.a ??
    "좋은 질문이에요! K-Stayble은 내·외국인에게 K-Pass Capsule(Open DID VC)을 발급해 신원을 표준화하고, 원화 스테이블 결제·OmniOne Chain 기록·AI 혜택을 잇는 관광 신뢰 지갑입니다. 온체인 프라이버시(해시만), 가맹점 VP 검증, 폐기, ZKP, 2-레이어 아키텍처 등 더 구체적으로 물어보면 자세히 답해드려요."
  )
}
