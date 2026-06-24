import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "K-Stayble — 기술 아키텍처 (To-Be)",
  description:
    "K-Stayble 기술 아키텍처: OmniOne CX · Open DID · OmniOne Chain 매핑, DID/VC/VP, 가맹점 검증, Privacy Edge, 2-레이어, ZKP, 데모↔결선 seam, 시퀀스 플로우.",
}

/* ── small server-side presentational helpers ─────────────────────────── */
function Seal({ size = 56 }: { size?: number }) {
  return (
    <span
      className="inline-grid flex-shrink-0 place-items-center rounded-2xl text-[#f7ede2]"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(150deg,#c2392f,#9c2a22)",
        boxShadow: "inset 0 0 0 3px rgba(247,237,226,.14), 0 10px 28px rgba(156,42,34,.28)",
        fontSize: size * 0.52,
        fontWeight: 700,
      }}
    >
      信
    </span>
  )
}
function Num({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[13px] font-semibold text-primary">{children}</span>
}
function H2({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <Num>{n}</Num>
      <h2 className="text-[clamp(20px,3vw,27px)] font-extrabold tracking-tight text-foreground">{children}</h2>
    </div>
  )
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 max-w-[68ch] text-[15px] leading-relaxed text-muted-foreground">{children}</p>
}
function Section({ children }: { children: React.ReactNode }) {
  return <section className="border-t border-border py-12">{children}</section>
}
function Node({ children, tone }: { children: React.ReactNode; tone?: "did" | "omn" | "evm" }) {
  const cls =
    tone === "did"
      ? "border-navy text-navy font-semibold"
      : tone === "omn"
        ? "border-primary text-primary font-semibold"
        : tone === "evm"
          ? "border-gold text-[var(--gold)] font-semibold"
          : "border-border text-foreground"
  return <span className={`rounded-lg border bg-card px-2.5 py-1.5 text-[12.5px] ${cls}`}>{children}</span>
}
function Layer({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-card ring-1 ring-border sm:grid-cols-[120px_1fr]">
      <div className="flex flex-col justify-center gap-0.5 border-b border-border bg-surface-2 px-4 py-3 sm:border-b-0 sm:border-r">
        <span className="font-mono text-[12px] font-semibold text-primary">{tag}</span>
        <span className="text-[13px] font-bold text-foreground">{title}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 p-3.5">{children}</div>
    </div>
  )
}
function Step({ n, who, children }: { n: number; who: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-primary/10 font-mono text-[12px] font-bold text-primary">
        {n}
      </span>
      <p className="text-[13.5px] leading-relaxed text-foreground">
        <span className="font-semibold text-navy">{who}</span> {children}
      </p>
    </li>
  )
}

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* top bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[940px] items-center justify-between px-5 py-3">
          <Link href="/" className="text-[13px] font-medium text-muted-foreground hover:text-foreground">
            ← K-Stayble
          </Link>
          <Link href="/ask" className="text-[13px] font-semibold text-primary hover:underline">
            기술 Q&amp;A AI →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[940px] px-5 pb-24">
        {/* hero */}
        <header className="grid grid-cols-1 gap-7 py-14 sm:grid-cols-[120px_1fr]">
          <div style={{ transform: "rotate(-4deg)" }}>
            <Seal size={112} />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              K-Stayble · 기술 아키텍처 (To-Be)
            </p>
            <h1 className="mt-3 text-[clamp(28px,6vw,48px)] font-extrabold leading-[1.06] tracking-tight text-foreground">
              신원 한 번이<br />권한 한 장으로
            </h1>
            <p className="mt-4 max-w-[62ch] text-[clamp(15px,2.2vw,18px)] leading-relaxed text-muted-foreground">
              내국인·외국인 누구로 본인확인을 했든, 서비스 권한은 <b className="text-primary">K-Pass Capsule</b> 한 장(VC)으로
              표준화됩니다. 결제·교통·혜택·가맹점 검증이 전부 이 한 장 위에서 일어납니다.
            </p>
            <div className="mt-5 border-l-[3px] border-primary py-1 pl-4 text-[15px] text-foreground">
              본인확인<b className="text-primary">(OmniOne CX)</b> → Open DID로 <b className="text-primary">K-Pass 발급(VC)</b> → 원화
              결제 → OmniOne Chain에 <b className="text-primary">이벤트 해시</b> 기록 → 가맹점이{" "}
              <b className="text-primary">VP로 자격 검증</b> → 정산.
            </div>
            <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-surface-2 px-3.5 py-2 font-mono text-[12px] text-muted-foreground ring-1 ring-border">
              <b className="text-foreground">As-is</b> 같은 인터페이스에 mock <span>→</span> <b className="text-foreground">To-be</b> 그
              자리에 실제 OmniOne 어댑터 교체
            </p>
          </div>
        </header>

        {/* 01 — OmniOne three solutions */}
        <Section>
          <H2 n="01">라온시큐어 OmniOne — 세 솔루션이 꽂히는 자리</H2>
          <Lead>
            우리 아키텍처에는 OmniOne의 세 솔루션이 들어갈 <b>정확한 코드 seam</b>이 이미 뚫려 있습니다. 데모는 그 seam에 mock을,
            결선엔 실제 SDK를 끼웁니다.
          </Lead>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              {
                bar: "var(--primary)",
                tag: "필수 요소",
                score: "MUST",
                title: "Mobile ID / OmniOne CX",
                body: "본인확인. 내국인=정부 모바일 신분증, 외국인=여권 eKYC, 장기체류=외국인등록증 — 전부 같은 인터페이스로 정규화.",
                code: "IdentityService.verify()",
              },
              {
                bar: "var(--navy)",
                tag: "가점 +5%",
                score: "+5%",
                title: "OmniOne Open DID",
                body: "확인된 신원으로 DID 생성, K-Pass Capsule을 VC로 발급. 가맹점 검증(VP)·선택적 공개도 여기.",
                code: "CapsuleService.issue() · VP",
              },
              {
                bar: "var(--gold)",
                tag: "가점 +5%",
                score: "+5%",
                title: "OmniOne Chain",
                body: "발급·결제·정산 이벤트를 해시로만 기록 + DID/키 레지스트리 + 폐기. 개인정보·원문은 절대 올리지 않음.",
                code: "ChainService.log()",
              },
            ].map((c) => (
              <div key={c.title} className="relative overflow-hidden rounded-2xl bg-card p-4 pt-5 ring-1 ring-border">
                <span className="absolute inset-x-0 top-0 h-1" style={{ background: c.bar }} />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground">{c.tag}</span>
                  <span className="rounded-full px-2 py-0.5 font-mono text-[10.5px] font-semibold" style={{ color: c.bar, border: `1px solid ${c.bar}` }}>
                    {c.score}
                  </span>
                </div>
                <h3 className="mt-2 text-[17px] font-bold text-foreground">{c.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{c.body}</p>
                <code className="mt-3 inline-block rounded-md bg-surface-2 px-2 py-1 font-mono text-[12px] text-foreground">{c.code}</code>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            한 줄: <b className="text-foreground">우리 데모의 인터페이스 3곳이 곧 OmniOne 세 솔루션의 자리</b>이고, 결선엔 어댑터만 교체합니다.
          </p>
        </Section>

        {/* 02 — To-Be layers */}
        <Section>
          <H2 n="02">To-Be 레이어 — 실제 시스템은 이렇게 돈다</H2>
          <Lead>화면(React)·상태·i18n은 데모와 결선이 동일합니다. 바뀌는 건 맨 아래 어댑터뿐 — 위 4개 레이어가 아래 OmniOne Chain에 앵커링됩니다.</Lead>
          <div className="flex flex-col gap-2.5">
            <Layer tag="L1" title="신원 진입">
              <Node>모바일 신분증 · 내국인</Node>
              <Node>여권 + eKYC · 외국인</Node>
              <Node>외국인등록증 · 장기체류</Node>
              <span className="text-muted-foreground">→</span>
              <Node tone="omn">OmniOne CX</Node>
            </Layer>
            <Layer tag="L2" title="신뢰 게이트웨이">
              <Node tone="did">DID 생성 (did:omn:…)</Node>
              <Node tone="did">VC Manager · K-Pass 발급</Node>
              <Node tone="did">DID 레지스트리 · 검증/폐기</Node>
              <span className="text-muted-foreground">↘</span>
              <Node>Open DID</Node>
            </Layer>
            <Layer tag="L3" title="K-Stayble 코어">
              <Node>결제·정책 라우터 (VC 속성=정책)</Node>
              <Node>KRW 스테이블 지갑</Node>
              <Node>AI 혜택 라우터 · 이상탐지</Node>
            </Layer>
            <Layer tag="L4" title="서비스·정산">
              <Node>교통 · 쇼핑 · 배달 · 예약</Node>
              <Node>가맹점 = Verifier</Node>
              <Node>정산</Node>
            </Layer>
          </div>
          <div className="card-ink mt-3 rounded-2xl p-5 text-white">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-[rgba(195,160,99,.5)] px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wide text-[var(--gold)]">
                On-chain · 신뢰 앵커
              </span>
              <h3 className="text-[16px] font-bold">OmniOne Chain — 이벤트 해시만 append</h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11.5px]">
              {["KPassIssued", "WalletLinked", "PaymentAuthorized", "VoucherIssued", "VoucherRedeemed", "PartnerSettlementLogged"].map((e) => (
                <code key={e} className="rounded-md border border-white/15 bg-white/[0.07] px-2 py-1 text-[#e9e3d4]">{e}</code>
              ))}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-white/70">
              L3·L4의 모든 상태 변화는 여기에 <b className="text-[var(--gold)]">해시로</b> 남습니다. 누구나 "일어났다 + 위변조 없음"은
              검증하지만 개인정보는 읽을 수 없습니다. <span className="text-white/55">(데모는 KPassIssued~VoucherRedeemed를 발생, PartnerSettlementLogged는 결선용.)</span>
            </p>
          </div>
        </Section>

        {/* 03 — chain real role + 2 layer + revocation */}
        <Section>
          <H2 n="03">체인은 "hash만" 올리나? — 진짜 하는 일 + 2-레이어</H2>
          <Lead>
            데모는 체인을 이벤트 로그로만 보여줬지만, Open DID에서 체인의 본진은 <b>신원 인프라</b>입니다. "프로그래머블 머니"는 별도
            레이어 — 둘을 K-Pass(VC)가 잇습니다.
          </Lead>
          <p className="mb-3 text-[14px] font-bold text-foreground">① 체인이 실제로 하는 일 — 수동 로그가 아니다</p>
          <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["DID · 키 레지스트리", "검증자가 발급자·소지자 공개키를 중앙 DB 없이 여기서 resolve해 서명 확인."],
              ["폐기 · 상태 레지스트리", "비자만료·분실·취소를 실시간 반영 — VP 검증이 즉시 실패. (결선 연동)"],
              ["발급자 신뢰 레지스트리", "누가 K-Pass를 발급·검증할 권한이 있는지 온체인 거버넌스."],
              ["감사 이벤트 앵커 (hash)", "그 위에 얹은 기능 — 6개 이벤트 해시. 본진이 아니라 보너스."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl bg-card p-4 ring-1 ring-border">
                <h3 className="text-[14px] font-bold text-foreground">{t}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <p className="mb-3 text-[14px] font-bold text-foreground">② 2-레이어 — "스마트컨트랙트는 왜 없냐"의 정답</p>
          <div className="flex flex-col gap-2.5">
            <Layer tag="신원" title="OmniOne Open DID">
              <Node tone="did">DID · 키 레지스트리</Node>
              <Node tone="did">폐기 · 상태</Node>
              <Node tone="did">발급자 trust registry</Node>
              <Node>감사 앵커(hash)</Node>
            </Layer>
            <Layer tag="머니" title="EVM 컨트랙트">
              <Node tone="evm">forKRW 스테이블</Node>
              <Node tone="evm">바우처 redeem</Node>
              <Node tone="evm">1/n 에스크로</Node>
              <Node tone="evm">정산 네팅</Node>
              <Node tone="evm">K-Pass SBT</Node>
            </Layer>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
            <b className="text-navy">K-Pass(VC)</b>가 두 레이어를 잇습니다. OmniOne Chain은 <b>DID 목적 permissioned 원장</b>이라,
            프로그래머블 머니 컨트랙트(레포의 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">forKRW + ForeignerSBT</code>,
            현재는 머니 레이어 개념을 보여주는 초기 실험)는 <b>EVM/L2</b>에 둡니다. 억지로 한 체인에 몰지 않는 게 더 정확한 그림입니다.
          </p>
          <div className="mt-5 rounded-xl border border-primary border-l-[4px] bg-primary/5 p-4">
            <p className="text-[13px] font-bold text-primary">⭐ 데모 한 방 — 폐기(Revocation)</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground">
              발급자가 K-Pass를 온체인에서 무효화 → 가맹점 VP 검증이 즉시 실패. 신원 심사진이 가장 좋아하는 "체인이 능동적으로 일하는"
              유즈케이스이자, 무대에서 한 컷으로 강력합니다. <span className="text-muted-foreground">(설계 완료, 결선에 OmniOne으로 연동.)</span>
            </p>
          </div>
        </Section>

        {/* 04 — DID vs VC */}
        <Section>
          <H2 n="04">DID vs VC — 식별자와 자격증명</H2>
          <Lead>가장 헷갈리는 핵심. 여권으로 비유하면 한 번에 잡힙니다.</Lead>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4"></th>
                  <th className="py-3 pr-4">DID</th>
                  <th className="py-3">VC (K-Pass Capsule)</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b [&>tr]:border-border">
                {[
                  ["정체", "식별자 + 키", "그 식별자에 대한 서명된 증명서"],
                  ["여권 비유", "여권 번호 + 내 도장(개인키)", "여권 책자 (이름·국적·유효기간)"],
                  ["담는 것", "did:omn:… → DID Document(공개키). 나에 대한 정보는 0", "발급자가 서명한 속성(체류·한도·등급·서비스)"],
                  ["역할", "신원 앵커", "그 위에 얹은 자격증명"],
                ].map(([k, a, b]) => (
                  <tr key={k}>
                    <td className="py-3 pr-4 font-semibold text-muted-foreground">{k}</td>
                    <td className="py-3 pr-4 text-foreground">{a}</td>
                    <td className="py-3 text-foreground">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-muted-foreground">
            관계 한 줄: 발급자(DID-A)가 <b className="text-foreground">소지자(DID-B)에 대한 주장</b>을 서명해 만든 게 VC. 가맹점에 내미는 건 VC에서
            필요한 것만 뽑은 <b className="text-foreground">VP</b>.
          </p>
        </Section>

        {/* 05 — merchant VP */}
        <Section>
          <H2 n="05">가맹점 VP — 정확히 무엇을 검증하나</H2>
          <Lead>
            <b>VP(Verifiable Presentation)</b>는 사용자가 자기 K-Pass(VC)에서 필요한 부분만 골라 내미는 "제시본". 가맹점은 이 VP만 보고
            원문(여권번호 등) 없이 자격을 확인합니다.
          </Lead>
          <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {[
              ["Issuer · 발급자", "OmniOne / 발급기관", "K-Pass VC에 서명해 발급", "border-primary"],
              ["→", "", "", ""],
              ["Holder · 소지자", "사용자 (지갑)", "필요한 속성만 VP로 제시", "border-navy"],
              ["→", "", "", ""],
              ["Verifier · 검증자", "가맹점 · 개찰구", "VP 검증 (DB 조회 없이)", "border-gold"],
            ].map((r, i) =>
              r[0] === "→" ? (
                <div key={i} className="hidden place-items-center text-muted-foreground sm:grid">→</div>
              ) : (
                <div key={i} className={`rounded-xl border bg-card p-3.5 text-center ${r[3]}`}>
                  <div className="font-mono text-[10.5px] uppercase tracking-wide text-muted-foreground">{r[0]}</div>
                  <div className="mt-1 text-[14px] font-bold text-foreground">{r[1]}</div>
                  <div className="mt-1 text-[12px] text-muted-foreground">{r[2]}</div>
                </div>
              ),
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ["a", "발급자 진위 (서명)", "신뢰된 기관이 실제 발급했나 — 발급자 DID·키를 레지스트리/체인에서 확인. 위조 불가, 중앙 DB 불필요."],
              ["b", "소지자 본인성 (holder binding)", "내미는 사람이 진짜 소지자인가 — VP가 소지자 키로 서명됨. 남의 패스 도용 차단."],
              ["c", "유효 · 미폐기 · 미만료", "체류기간이 살아있고 취소·만료되지 않았는가 — 폐기 레지스트리 확인."],
              ["d", "필요한 자격만 (predicate)", '"외국인 관광객?", "면세 자격?", "쿠폰 미사용?", "19세↑?" — 그것도 원문 없이 "충족됨"으로.'],
            ].map(([n, t, d]) => (
              <div key={n} className="flex gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
                <span className="font-mono text-[14px] font-bold text-primary">{n}</span>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground">{t}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-navy bg-navy/5 p-4">
              <p className="text-[13px] font-bold text-navy">가맹점에 보이는 것 (공개)</p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-foreground">
                {["외국인 관광객 — 검증됨", "체류기간 유효 (> 0)", "면세 자격 충족", "이 쿠폰 미사용"].map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-primary bg-primary/5 p-4">
              <p className="text-[13px] font-bold text-primary">절대 넘어가지 않는 것 (비공개)</p>
              <ul className="mt-2 space-y-1.5 text-[13px] text-foreground">
                {["여권번호", "이름 · 생년월일", "주소 · 연락처", "결제 원문 · 사진"].map((x) => (
                  <li key={x}>✕ {x}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            검증 통과 후 가맹점은 <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">PartnerSettlementLogged</code>를
            OmniOne Chain에 해시로 남겨 정산·감사 근거로 씁니다. (가맹점 VP 검증·정산은 결선 연동.)
          </p>
        </Section>

        {/* 06 — sequence flows */}
        <Section>
          <H2 n="06">시퀀스 — 발급 · 사용 · 검증</H2>
          <Lead>세 가지 핵심 흐름. CX·Open DID·OmniOne Chain이 각 단계에 등장합니다.</Lead>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {[
              {
                t: "① 발급",
                steps: [
                  ["사용자", "유형 선택(내·외국인) + 인증 시작"],
                  ["CX", "모바일 신분증 / 여권 eKYC 본인확인 → 최소 속성(원문 미저장)"],
                  ["Open DID", "DID 생성 + K-Pass Capsule을 VC로 발급"],
                  ["Chain", "log(KPassIssued), log(WalletLinked) — 해시만"],
                  ["사용자", "K-Pass 발급 완료 + KRW 지갑 연결"],
                ],
              },
              {
                t: "② 사용 (결제)",
                steps: [
                  ["사용자", "가게 결제 / 충전 / 남은 원화 전환"],
                  ["지갑", "잔액 변경 (결제한도 등 정책 체크)"],
                  ["Chain", "log(PaymentAuthorized | VoucherIssued | VoucherRedeemed)"],
                  ["사용자", '인라인 영수증 "OmniOne에 기록됨"'],
                ],
              },
              {
                t: "③ 가맹점 검증 (VP)",
                steps: [
                  ["가맹점", "자격 증명 요청 (예: 체류>0, 면세 자격)"],
                  ["사용자", "공개할 속성 선택 (Selective Disclosure) → 동의"],
                  ["사용자", 'VP 제시 ("검증됨"만, 여권번호 없음)'],
                  ["Open DID", "VP 검증 (서명·발급자·폐기·유효성)"],
                  ["가맹점", "유효 → 서비스 제공 + 정산 해시 기록"],
                ],
              },
            ].map((flow) => (
              <div key={flow.t} className="rounded-2xl bg-card p-5 ring-1 ring-border">
                <h3 className="mb-3 text-[15px] font-bold text-foreground">{flow.t}</h3>
                <ol className="space-y-2.5">
                  {flow.steps.map(([who, txt], i) => (
                    <Step key={i} n={i + 1} who={who}>
                      {txt}
                    </Step>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>

        {/* 07 — Privacy Edge + ZKP */}
        <Section>
          <H2 n="07">Privacy Edge & ZKP</H2>
          <Lead>국적·체류기간·쿠폰 중복 여부를 원문 없이 증명. 심사진(라온시큐어 엔지니어)이 가장 먼저 보는 지점입니다.</Lead>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4">위치</th>
                  <th className="py-3 pr-4">무엇이 저장되나</th>
                  <th className="py-3">의미</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b [&>tr]:border-border align-top">
                <tr>
                  <td className="py-3 pr-4 font-bold text-primary">On-chain<br /><span className="font-normal text-muted-foreground">OmniOne Chain</span></td>
                  <td className="py-3 pr-4 text-foreground">이벤트 해시만 (6종) + DID/키 레지스트리 + 폐기 상태</td>
                  <td className="py-3 text-foreground">"일어났다 + 위변조 없음"의 공개 증거. 개인정보 0.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold text-navy">Off-chain<br /><span className="font-normal text-muted-foreground">기기 · 발급자</span></td>
                  <td className="py-3 pr-4 text-foreground">여권번호 · 개인정보 · 결제 원문 · 사진 · VC 원본</td>
                  <td className="py-3 text-foreground">소지자/발급자만 보유. 검증은 VP로 — 원문 이동 없음.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-xl bg-surface-2 p-4 ring-1 ring-border">
            <p className="text-[14px] font-bold text-foreground">ZKP · 선택적 공개 (BBS+)</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
              발급자가 VC를 <b className="text-foreground">BBS+ 서명</b>으로 발급 → 소지자가 <b className="text-foreground">술어만 증명</b>(나이≥19,
              체류&gt;0)하거나 고른 속성만 공개. 제시본이 <b className="text-foreground">비연결성(unlinkable)</b>이라 가맹점들이 같은 사용자를 추적할 수
              없습니다. K-Stayble의 Privacy Edge는 이를 전제로 <b>설계</b>됐고, 실제 ZKP 연산은 <b>결선</b>에 OmniOne으로 붙습니다.
            </p>
          </div>
        </Section>

        {/* 08 — the seam */}
        <Section>
          <H2 n="08">The Seam — 데모가 그대로 결선이 된다</H2>
          <Lead>
            핵심 메시지: <b>"우리 데모의 인터페이스가 곧 OmniOne 세 솔루션의 자리"</b>. 화면 코드는 한 줄도 안 바꾸고 아래 한 줄만 mock → real로
            바꿉니다 (<code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">lib/services/index.ts</code>의{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">DEMO_MODE</code>).
          </Lead>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-border text-left font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="py-3 pr-4">인터페이스</th>
                  <th className="py-3 pr-4">As-is · 데모 (현재)</th>
                  <th className="py-3">To-be · 결선 어댑터</th>
                </tr>
              </thead>
              <tbody className="[&>tr]:border-b [&>tr]:border-border">
                {[
                  ["IdentityService", "deterministic mock", "OmniOne CX SDK (모바일 신분증 / eKYC)"],
                  ["CapsuleService", "mock VC 발급", "Open DID — VC 발급 / VP 검증 API"],
                  ["ChainService", "로컬 이벤트 시뮬", "OmniOne Chain — tx 기록 + explorer + 폐기"],
                  ["WalletService", "localStorage 잔액", "KRW 스테이블코인 결제 레일"],
                  ["BenefitService", "규칙 기반 + 데모 챗", "LLM + 추천 / 이상탐지 백엔드"],
                ].map(([i, a, b]) => (
                  <tr key={i}>
                    <td className="py-3 pr-4"><code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[12px]">{i}</code></td>
                    <td className="py-3 pr-4 text-muted-foreground">{a}</td>
                    <td className="py-3 font-semibold text-primary">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* 09 — roadmap */}
        <Section>
          <H2 n="09">결선 로드맵 (9/30)</H2>
          <Lead>지금은 Phase-0 클릭 데모. 결선엔 화면 변경 없이 실제 어댑터를 끼웁니다.</Lead>
          <div className="flex flex-wrap gap-2">
            {[
              "실제 Mobile ID / 여권 eKYC",
              "Open DID VC 발급",
              "OmniOne Chain 기록 + 폐기",
              "KRW 스테이블코인 정산",
              "가맹점 VP 검증 + 정산 대시보드",
              "ZKP 선택적 공개",
              "AI 이상탐지",
            ].map((x) => (
              <span key={x} className="rounded-full bg-surface-2 px-3 py-1.5 text-[12.5px] font-medium text-foreground ring-1 ring-border">
                {x}
              </span>
            ))}
          </div>
        </Section>

        <footer className="border-t border-border pt-8 text-[12.5px] text-muted-foreground">
          <p className="font-mono text-foreground">K-STAYBLE — Hope &amp; Woogieboogie · 2026 블록체인 &amp; AI 해커톤 (Track 2 / MVP)</p>
          <p className="mt-1.5">
            데모 빌드의 서비스 인터페이스는 OmniOne CX · Open DID · OmniOne Chain 어댑터로 그대로 교체됩니다. 더 궁금한 점은{" "}
            <Link href="/ask" className="font-semibold text-primary hover:underline">기술 Q&amp;A AI</Link>에서.
          </p>
        </footer>
      </div>
    </div>
  )
}
