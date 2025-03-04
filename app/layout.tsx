import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "John Doe | Portfolio",
  description: "Full Stack Developer & Creative Technologist",
  keywords: ["developer", "portfolio", "react", "next.js", "3D", "web development"],
  authors: [{ name: "John Doe" }],
  creator: "John Doe",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://johndoe-portfolio.com",
    title: "John Doe | Portfolio",
    description: "Full Stack Developer & Creative Technologist",
    siteName: "John Doe Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "John Doe | Portfolio",
    description: "Full Stack Developer & Creative Technologist",
    creator: "@johndoe",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

