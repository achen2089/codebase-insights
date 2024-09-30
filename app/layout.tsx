import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "@/auth"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Codebase Insights",
  description:
    "Get insights into your codebase",
}

export default async function RootLayout({ children }: React.PropsWithChildren) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="flex h-full min-h-screen w-full flex-col justify-between">
            <Header />
            <main className="mx-auto w-full max-w-3xl flex-auto px-4 py-4 sm:px-6 md:py-6">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
