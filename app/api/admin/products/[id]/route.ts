import { NextResponse } from 'next/server'
import { readProducts, writeProducts } from '@/lib/productsStore'
import { type Product } from '@/lib/products'

export async function PUT(_req: Request, { params }: { params: { id: string } }) {
  try {
    const body = (await _req.json()) as Partial<Product>
    const items = await readProducts()
    const idx = items.findIndex((p) => p.id === params.id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const merged: Product = { ...items[idx], ...body } as Product
    items[idx] = merged
    await writeProducts(items)
    return NextResponse.json(merged)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid body' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const items = await readProducts()
  const idx = items.findIndex((p) => p.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const removed = items.splice(idx, 1)
  await writeProducts(items)
  return NextResponse.json({ ok: true, removed: removed[0] })
}

