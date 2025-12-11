import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const nunito = Nunito({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "С Днём Рождения! 🎂",
  description: "A special birthday surprise for someone special",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased ${nunito.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
