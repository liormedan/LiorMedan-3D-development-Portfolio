"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/products'

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Product>>({ price: { amount: 0, currency: 'ILS' } as any })
  const [error, setError] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const submit = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setForm({ price: { amount: 0, currency: 'ILS' } as any })
      await fetchItems()
    } catch (e: any) {
      setError(e?.message || 'Error')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('למחוק מוצר?')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) fetchItems()
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">ניהול מוצרים</h1>
          <Link href="/products" className="text-sm text-zinc-300 hover:text-white">לתצוגת חנות</Link>
        </div>

        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
          <div className="text-lg mb-3">הוספת מוצר</div>
          {error && <div className="text-sm text-red-400 mb-2">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right">
            <input placeholder="id" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={form.id || ''} onChange={(e) => setForm({ ...form, id: e.target.value })} />
            <input placeholder="slug" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <input placeholder="שם" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="מחיר" type="number" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={(form.price as any)?.amount ?? 0} onChange={(e) => setForm({ ...form, price: { ...(form.price as any), amount: Number(e.target.value) } })} />
            <select className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={(form.price as any)?.currency ?? 'ILS'} onChange={(e) => setForm({ ...form, price: { ...(form.price as any), currency: e.target.value as any } })}>
              <option value="ILS">ILS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <input placeholder="thumbnail (אופציונלי)" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={form.thumbnail || ''} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} />
            <input placeholder="modelPath (אופציונלי)" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={form.modelPath || ''} onChange={(e) => setForm({ ...form, modelPath: e.target.value })} />
            <input placeholder="תגיות מופרדות בפסיק" className="px-3 py-2 rounded bg-black border border-zinc-800"
              value={(form.tags as any)?.join(',') || ''} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
            <div className="sm:col-span-3">
              <textarea placeholder="תיאור" className="w-full px-3 py-2 rounded bg-black border border-zinc-800"
                value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-3 flex items-center gap-3 justify-end">
              <button disabled={saving} onClick={submit} className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">הוספה</button>
            </div>
          </div>
        </div>

        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
          <div className="text-lg mb-3">מוצרים</div>
          {loading ? (
            <div className="text-zinc-400">טוען…</div>
          ) : items.length === 0 ? (
            <div className="text-zinc-400">אין מוצרים</div>
          ) : (
            <div className="space-y-2">
              {items.map((p) => (
                <div key={p.id} className="flex items-center justify-between border border-zinc-800 rounded p-3 bg-black">
                  <div className="text-right">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-zinc-400">{p.id} · {p.slug}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}`} className="text-sm px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700">עריכה</Link>
                    <button onClick={() => remove(p.id)} className="text-sm px-3 py-1 rounded bg-red-700 hover:bg-red-600">מחיקה</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-900">
          <div className="text-lg mb-3">העלאת קובץ מודל (ל־public/models)</div>
          <UploadForm />
        </div>
      </div>
    </main>
  )
}

function UploadForm() {
  const [resPath, setResPath] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  return (
    <div className="flex items-center gap-3">
      <input type="file" accept=".glb,.gltf,.bin,.ktx2,.png,.jpg,.jpeg" className="text-sm" onChange={async (e) => {
        const f = e.target.files?.[0]
        if (!f) return
        setBusy(true)
        setError(null)
        try {
          const fd = new FormData()
          fd.append('file', f)
          const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (!res.ok) throw new Error(data?.error || 'Upload failed')
          setResPath(data.path)
        } catch (e: any) {
          setError(e?.message || 'Error')
        } finally {
          setBusy(false)
        }
      }} />
      {busy && <span className="text-sm text-zinc-400">מעלה…</span>}
      {resPath && (
        <code className="text-xs bg-black/50 px-2 py-1 rounded border border-zinc-800">{resPath}</code>
      )}
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  )
}

