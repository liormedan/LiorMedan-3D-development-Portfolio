"use client"

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-3xl sm:text-4xl font-semibold">חנות 3D – אפליקציות</h1>
        <p className="text-zinc-300">בחרו אפליקציה:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          <Link href="/products" className="block rounded-lg border border-zinc-800 hover:border-zinc-600 p-4 bg-zinc-900">
            <div className="text-lg font-medium mb-2">מוצרים בתלת־ממד</div>
            <div className="text-sm text-zinc-400">הצגה למכירה + הורדת דגם</div>
          </Link>
          <Link href="/audio-visualizer" className="block rounded-lg border border-zinc-800 hover:border-zinc-600 p-4 bg-zinc-900">
            <div className="text-lg font-medium mb-2">הדמיית גלי קול</div>
            <div className="text-sm text-zinc-400">טעינת קובץ אודיו והמחשה בתלת־ממד</div>
          </Link>
          <Link href="/file-explorer" className="block rounded-lg border border-zinc-800 hover:border-zinc-600 p-4 bg-zinc-900">
            <div className="text-lg font-medium mb-2">סייר קבצים 3D</div>
            <div className="text-sm text-zinc-400">הצגת תיקייה/קבצים בתצוגה תלת־ממדית</div>
          </Link>
        </div>
      </div>
    </main>
  )
}
