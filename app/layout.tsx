import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'לירן מדן | תיק עבודות 3D Portfolio',
  description: 'מפתח ומעצב חוויות דיגיטליות תלת-ממדיות מרהיבות עם React, Three.js ו-Next.js. תיק עבודות אינטראקטיבי עם דוגמאות מתקדמות',
  keywords: ['React', 'Three.js', 'Next.js', '3D', 'WebGL', 'Portfolio', 'Frontend Developer', 'תיק עבודות'],
  authors: [{ name: 'לירן מדן' }],
  creator: 'לירן מדן',
  openGraph: {
    title: 'לירן מדן | תיק עבודות 3D Portfolio',
    description: 'מפתח ומעצב חוויות דיגיטליות תלת-ממדיות מרהיבות',
    type: 'website',
    locale: 'he_IL',
    siteName: 'תיק עבודות 3D',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'לירן מדן | תיק עבודות 3D Portfolio',
    description: 'מפתח ומעצב חוויות דיגיטליות תלת-ממדיות מרהיבות',
  },
  robots: {
    index: true,
    follow: true,
  },
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