import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from '../components/provider'
import SideBar from '@/components/side-bar'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'De-Cloud',
  description: 'A solution for all your sensitive data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {/* <Provider> */}
        <div className='flex'>
          <SideBar />
          {children}
        </div>
        <Toaster />
      {/* </Provider> */}
      </body>
    </html>
  )
}
