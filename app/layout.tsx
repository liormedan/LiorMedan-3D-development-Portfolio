import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'תיק עבודות 3D | Portfolio',
  description: 'תיק עבודות מתקדם עם דוגמאות תלת-ממדיות ואנימציות',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}