import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug } from '@/lib/products'
import ProductDetailClient from '../ProductDetailClient'

function abs(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  try {
    return new URL(path, base).toString()
  } catch {
    return path
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return {}
  const title = `${product.name} – מוצר 3D`
  const description = product.description || 'מוצר תלת־ממד לצפייה והורדה.'
  const image = product.thumbnail || '/images/placeholder-thumb.svg'
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: abs(`/products/${product.slug}`),
      type: 'website',
      images: [{ url: abs(image), width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [abs(image)],
    },
  }
}

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
