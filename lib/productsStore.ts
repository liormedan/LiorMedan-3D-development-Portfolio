import { promises as fs } from 'fs'
import path from 'path'
import { products as fallbackProducts, type Product } from '@/lib/products'

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'products.json')

export async function readProducts(): Promise<Product[]> {
  try {
    const buf = await fs.readFile(dataFile, 'utf-8')
    const parsed = JSON.parse(buf)
    if (Array.isArray(parsed)) return parsed as Product[]
  } catch {}
  return fallbackProducts
}

export async function writeProducts(items: Product[]): Promise<void> {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf-8')
}

export async function getProductBySlugDynamic(slug: string): Promise<Product | undefined> {
  const list = await readProducts()
  return list.find((p) => p.slug === slug)
}

