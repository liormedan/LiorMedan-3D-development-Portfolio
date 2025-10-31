"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/products'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/products')
      const list = (await res.json()) as Product[]
      setItem(list.find((x) => x.id === params.id) || null)
    })()
  }, [params.id])

  const save = async () => {
    if (!item) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/products/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data?.error || 'Failed')
      }
      alert('נשמר!')
    } catch (e: any) {
      setError(e?.message || 'Error')
    } finally {
      setSaving(false)
    }
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-zinc-400">טוען…</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">עריכת מוצר</h1>
          <Link href="/admin/products" className="text-sm text-zinc-300 hover:text-white">חזרה לניהול</Link>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        <div className="grid grid-cols-1 gap-3 text-right">
          <label className="text-sm">ID
            <input disabled className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.id} />
          </label>
          <label className="text-sm">Slug
            <input className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.slug}
              onChange={(e) => setItem({ ...item, slug: e.target.value })} />
          </label>
          <label className="text-sm">שם
            <input className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.name}
              onChange={(e) => setItem({ ...item, name: e.target.value })} />
          </label>
          <label className="text-sm">תיאור
            <textarea className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.description || ''}
              onChange={(e) => setItem({ ...item, description: e.target.value })} />
          </label>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-sm">מחיר
              <input type="number" className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.price.amount}
                onChange={(e) => setItem({ ...item, price: { ...item.price, amount: Number(e.target.value) } })} />
            </label>
            <label className="text-sm">מטבע
              <select className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.price.currency}
                onChange={(e) => setItem({ ...item, price: { ...item.price, currency: e.target.value as any } })}>
                <option value="ILS">ILS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>
          </div>
          <label className="text-sm">Thumbnail
            <input className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.thumbnail || ''}
              onChange={(e) => setItem({ ...item, thumbnail: e.target.value })} />
          </label>
          <label className="text-sm">Model Path
            <input className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={item.modelPath || ''}
              onChange={(e) => setItem({ ...item, modelPath: e.target.value })} />
          </label>
          <label className="text-sm">תגיות (מופרדות בפסיק)
            <input className="w-full px-3 py-2 rounded bg-black border border-zinc-800" value={(item.tags || []).join(',')}
              onChange={(e) => setItem({ ...item, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
          </label>
          <div className="flex justify-end">
            <button disabled={saving} onClick={save} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">שמירה</button>
          </div>
        </div>
        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
          <div className="text-lg mb-3">העלאת קובץ מודל</div>
          <InlineUpload onDone={(path) => setItem({ ...item, modelPath: path })} />
        </div>
      </div>
    </main>
  )
}

function InlineUpload({ onDone }: { onDone: (path: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  return (
    <div className="flex items-center gap-3">
      <input type="file" accept=".glb,.gltf,.bin,.ktx2,.png,.jpg,.jpeg" className="text-sm" onChange={async (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setBusy(true)
        setErr(null)
        try {
          const fd = new FormData()
          fd.append('file', f)
          const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (!res.ok) throw new Error(data?.error || 'Upload failed')
          onDone(data.path as string)
        } catch (e: any) {
          setErr(e?.message || 'Error')
        } finally {
          setBusy(false)
        }
      }} />
      {busy && <span className="text-sm text-zinc-400">מעלה…</span>}
      {err && <span className="text-sm text-red-400">{err}</span>}
    </div>
  )}

