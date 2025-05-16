import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "2048 Game",
  description: "Trò chơi 2048 với phần quà bất ngờ",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "2048 Game",
    description: "Trò chơi 2048 với phần quà bất ngờ",
    url: "https://2048game.example.com",
    siteName: "2048 Game",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "2048 Game",
      },
    ],
    locale: "en_US",
    type: "website",
  },
    generator: 'Dilo'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
