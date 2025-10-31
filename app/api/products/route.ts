import { NextResponse } from 'next/server'
import { products, getProductBySlug } from '@/lib/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  if (slug) {
    const item = getProductBySlug(slug)
    if (!item) return NextResponse.json({ error: 'Not Found' }, { status: 404 })
    return NextResponse.json(item)
  }
  return NextResponse.json(products)
}

