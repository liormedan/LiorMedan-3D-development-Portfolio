import { NextResponse } from 'next/server'
import { readProducts, writeProducts } from '@/lib/productsStore'
import { type Product } from '@/lib/products'

export async function GET() {
  const items = await readProducts()
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<Product>
    if (!body || !body.id || !body.slug || !body.name || !body.price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const items = await readProducts()
    if (items.some((p) => p.id === body.id || p.slug === body.slug)) {
      return NextResponse.json({ error: 'ID or slug already exists' }, { status: 409 })
    }
    const next: Product = {
      id: body.id,
      slug: body.slug,
      name: body.name,
      description: body.description || '',
      price: body.price!,
      thumbnail: body.thumbnail || '',
      modelPath: body.modelPath || '',
      tags: body.tags || [],
      downloads: body.downloads || [],
    }
    items.push(next)
    await writeProducts(items)
    return NextResponse.json(next, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid body' }, { status: 400 })
  }
}

