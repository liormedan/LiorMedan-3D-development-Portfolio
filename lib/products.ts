export type Price = {
  amount: number
  currency: 'ILS' | 'USD' | 'EUR'
}

export type Product = {
  id: string
  slug: string
  name: string
  description?: string
  price: Price
  thumbnail?: string
  modelPath?: string // relative to /public (e.g., /models/chair.glb)
  tags?: string[]
  downloads?: { label: string; path: string }[] // relative/static links
}

export const products: Product[] = [
  {
    id: 'demo-cube',
    slug: 'demo-cube',
    name: 'דגם דמו – קובייה',
    description: 'דגם בסיסי לצורכי הדגמה. ניתן להחליף במודל GLB/GLTF אמיתי.',
    price: { amount: 0, currency: 'ILS' },
    thumbnail: '/images/demo-cube.png',
    // modelPath: '/models/demo-cube.glb', // להוסיף קובץ בעתיד
    tags: ['demo', 'basic'],
    downloads: [
      // { label: 'GLB', path: '/models/demo-cube.glb' },
    ],
  },
  {
    id: 'future-chair',
    slug: 'future-chair',
    name: 'כיסא עתידני',
    description: 'מודל כיסא עם עיצוב מינימליסטי. מותאם לתצוגה אינטרנטית.',
    price: { amount: 99, currency: 'ILS' },
    thumbnail: '/images/future-chair.jpg',
    // modelPath: '/models/future-chair.glb',
    tags: ['chair', 'interior'],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

