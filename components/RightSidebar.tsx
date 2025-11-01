"use client"

import React from 'react'

export default function RightSidebar({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="w-full md:w-80 shrink-0">
      <div className="sticky top-4 space-y-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        {title && <div className="text-xs uppercase tracking-wide text-zinc-400">{title}</div>}
        {children}
      </div>
    </aside>
  )
}

