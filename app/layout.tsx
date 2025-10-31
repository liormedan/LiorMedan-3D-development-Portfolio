import './globals.css'
import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'חנות 3D | 3D Store',
    template: '%s | 3D Store',
  },
  description:
    'חנות 3D ותצוגות אינטראקטיביות: מודלים להדמיה/הורדה, הדמיית אודיו, וסייר קבצים בתלת־ממד. Built with Next.js, React Three Fiber, Three.js.',
  keywords: [
    '3D',
    'GLTF',
    'GLB',
    'Three.js',
    'React Three Fiber',
    'Next.js',
    'Virtual Store',
    'חנות 3D',
  ],
  authors: [{ name: 'Lior Medan' }],
  creator: 'Lior Medan',
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    url: siteUrl,
    siteName: '3D Store',
    title: '3D Store – חנות ותצוגות תלת־ממד',
    description:
      'מודלים בתלת־ממד להמחשה/הורדה, הדמיית גלי קול וסייר קבצים 3D. Next.js + Three.js.',
    images: [
      {
        url: '/images/placeholder-thumb.svg',
        width: 1200,
        height: 630,
        alt: '3D Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@liormedan',
    title: '3D Store – חנות ותצוגות תלת־ממד',
    description: 'מודלים 3D, הדמיית אודיו, וסייר קבצים 3D.',
    images: ['/images/placeholder-thumb.svg'],
  },
  robots: { index: true, follow: true },
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

