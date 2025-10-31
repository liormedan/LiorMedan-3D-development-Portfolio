import { NextResponse } from 'next/server'
import { readProducts } from '@/lib/productsStore'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (slug) {
    const list = await readProducts()
    const item = list.find((p) => p.slug === slug)
    if (!item) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json(item)
  }
  const list = await readProducts()
  return NextResponse.json(list)
}
