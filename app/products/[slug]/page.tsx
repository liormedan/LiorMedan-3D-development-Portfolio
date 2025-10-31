import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import ProductDetailClient from '../ProductDetailClient'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) return notFound()
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <ProductDetailClient product={product} />
      </div>
    </main>
  )
}

