"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Center, useGLTF, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, Suspense } from 'react'
import Link from 'next/link'
import { type Product } from '@/lib/products'
import { useCart } from '@/lib/cart'

function SpinningProduct() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5
  })
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#64b5f6" metalness={0.2} roughness={0.4} />
    </mesh>
  )
}

function ProductModel({ path }: { path: string }) {
  const group = useRef<THREE.Group>(null)
  const gltf = useGLTF(path)
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.2
  })
  return (
    <group ref={group}>
      <Center>
        {/* @ts-ignore */}
        <primitive object={gltf.scene} />
      </Center>
    </group>
  )
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const add = useCart((s) => s.add)
  const [exporting, setExporting] = useState<'none' | 'gltf' | 'glb'>('none')

  const exportScene = async (binary: boolean) => {
    if (exporting !== 'none') return
    setExporting(binary ? 'glb' : 'gltf')
    try {
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
      const exporter = new GLTFExporter()
      const scene = (document.querySelector('#product-detail-canvas') as any)?._three?.scene
      // Fallback: try to find first canvas' scene via React Three Fiber internal state
      const scenes = (window as any).__r3f?
        Array.from((window as any).__r3f.roots.values()).map((r: any) => r.store.getState().get().scene) : []
      const targetScene = scene || scenes?.[0]
      if (!targetScene) throw new Error('Scene not found for export')
      exporter.parse(
        targetScene,
        (gltf) => {
          let blob: Blob
          let filename: string
          if (binary) {
            blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' })
            filename = `${product.slug || 'product'}.glb`
          } else {
            const json = JSON.stringify(gltf)
            blob = new Blob([json], { type: 'model/gltf+json' })
            filename = `${product.slug || 'product'}.gltf`
          }
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          a.click()
          URL.revokeObjectURL(url)
          setExporting('none')
        },
        { binary }
      )
    } catch (e) {
      console.error(e)
      setExporting('none')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-zinc-400 text-sm mt-1">
            {product.price.amount} {product.price.currency}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => add(product.id, 1)}
            className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500"
          >
            הוספה לסל
          </button>
          <Link href="/products" className="text-sm text-zinc-300 hover:text-white">חזרה לרשימה</Link>
        </div>
      </div>

      <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
        <Canvas id="product-detail-canvas" shadows camera={{ position: [3, 2, 4], fov: 50 }}>
          <Suspense fallback={<Html center style={{ color: '#cbd5e1' }}>טוען מודל…</Html>}>
            <color attach="background" args={[0.05, 0.05, 0.06]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <group position={[0, 0.5, 0]}>
              {product.modelPath ? <ProductModel path={product.modelPath} /> : <SpinningProduct />}
            </group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
              <planeGeometry args={[20, 20]} />
              <shadowMaterial opacity={0.2} />
            </mesh>
            <Environment preset="city" />
            <OrbitControls makeDefault enableDamping minDistance={1.2} maxDistance={10} minPolarAngle={0.2} maxPolarAngle={Math.PI / 2} />
          </Suspense>
        </Canvas>
      </div>

      <div className="flex items-center gap-2 justify-end">
        {product.modelPath && (
          <a href={product.modelPath} download className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm">
            הורדת קובץ מקור
          </a>
        )}
        <button
          onClick={() => exportScene(false)}
          disabled={exporting !== 'none'}
          className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm"
        >
          {exporting === 'gltf' ? 'מייצא…' : 'ייצוא כ‑GLTF'}
        </button>
        <button
          onClick={() => exportScene(true)}
          disabled={exporting !== 'none'}
          className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm"
        >
          {exporting === 'glb' ? 'מייצא…' : 'ייצוא כ‑GLB'}
        </button>
        <button
          onClick={() => {
            const cnv = document.querySelector('#product-detail-canvas canvas') as HTMLCanvasElement | null
            if (!cnv) return
            const url = cnv.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = url
            a.download = `${product.slug || 'product'}-thumb.png`
            a.click()
          }}
          className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
        >
          יצירת Thumbnail
        </button>
      </div>

      {product.description && (
        <p className="text-sm text-zinc-300 leading-6 text-right">{product.description}</p>
      )}

      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-end">
          {product.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-300">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}
