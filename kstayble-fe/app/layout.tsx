import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/lib/store/app-provider"
import { LangProvider } from "@/lib/i18n/lang-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
// Korean glyphs render via the OS Korean fonts in the --font-sans stack
// (Apple SD Gothic Neo / Malgun Gothic / Noto Sans KR) — no webfont gamble.

export const metadata: Metadata = {
  title: "K-Tour ID — AI Tourist Trust Wallet",
  description:
    "K-Tour ID issues a digital tourism resident pass (K-Pass Capsule) on Mobile ID & Passport DID, linking KRW stablecoin payments and AI benefits for visitors to Korea.",
  generator: "K-Tour ID",
}

export const viewport: Viewport = {
  themeColor: "#1c1813", // 먹 ink — matches the warm palette
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // so env(safe-area-inset-*) resolves on notched iOS
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${inter.variable} antialiased`}>
      <body className="font-sans">
        <LangProvider>
          <AppProvider>{children}</AppProvider>
        </LangProvider>
      </body>
    </html>
  )
}
