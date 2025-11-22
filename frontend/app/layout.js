import './globals.css'
import { Inter } from 'next/font/google'
import QueryProvider from '@/providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StockMaster - Inventory Management System',
  description: 'Complete inventory management solution',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}

