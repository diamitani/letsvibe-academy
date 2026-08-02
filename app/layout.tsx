import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LetsVibeAI — The AI Building Academy",
  description:
    "Turn your ideas into tested, presentable projects with structured lessons, an AI workspace, and safe project sandboxes.",
  keywords: ["AI learning", "vibe coding", "AI projects", "learn AI", "build with AI", "AI academy"],
  openGraph: {
    title: "LetsVibeAI — The AI Building Academy",
    description:
      "Turn your ideas into tested, presentable projects with structured lessons, an AI workspace, and safe project sandboxes.",
    type: "website",
    siteName: "LetsVibeAI",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}