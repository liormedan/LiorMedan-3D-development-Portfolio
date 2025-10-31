"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { products, type Product } from '@/lib/products'

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
        {/* Render the loaded GLTF scene */}
        {/* @ts-ignore - drei's primitive typing */}
        <primitive object={gltf.scene} />
      </Center>
    </group>
  )
}

// Preload any known product models
for (const p of products) {
  if (p.modelPath) {
    try {
      // @ts-ignore
      useGLTF.preload(p.modelPath)
    } catch {}
  }
}

function ProductViewer({ product }: { product: Product }) {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const [exporting, setExporting] = useState<'none' | 'gltf' | 'glb'>('none')

  const onCreated = useCallback(({ scene }: { scene: THREE.Scene }) => {
    sceneRef.current = scene
  }, [])

  const doExport = async (binary: boolean) => {
    if (!sceneRef.current || exporting !== 'none') return
    setExporting(binary ? 'glb' : 'gltf')
    try {
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
      const exporter = new GLTFExporter()
      exporter.parse(
        sceneRef.current,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium truncate">תצוגה: {product.name}</h2>
        <div className="flex items-center gap-2">
          {product.modelPath && (
            <a
              href={product.modelPath}
              download
              className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm"
            >
              הורדת דגם
            </a>
          )}
          <button
            onClick={() => doExport(false)}
            disabled={exporting !== 'none'}
            className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm"
          >
            {exporting === 'gltf' ? 'מייצא…' : 'ייצוא כ‑GLTF'}
          </button>
          <button
            onClick={() => doExport(true)}
            disabled={exporting !== 'none'}
            className="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-sm"
          >
            {exporting === 'glb' ? 'מייצא…' : 'ייצוא כ‑GLB'}
          </button>
        </div>
      </div>
      <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
        <Canvas shadows camera={{ position: [3, 2, 4], fov: 50 }} onCreated={onCreated}>
          <color attach="background" args={[0.05, 0.05, 0.06]} />
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <group position={[0, 0.5, 0]}>
            {product.modelPath ? (
              <ProductModel path={product.modelPath} />
            ) : (
              <SpinningProduct />
            )}
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
          <Environment preset="city" />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  const [selected, setSelected] = useState<Product>(products[0]!)

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">מוצרים בתלת־ממד</h1>
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-sm text-zinc-300 hover:text-white">לסל</Link>
            <Link href="/" className="text-sm text-zinc-300 hover:text-white">חזרה לדף הבית</Link>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className={`text-right border rounded-lg p-4 bg-zinc-900 hover:border-zinc-600 border-zinc-800 ${
                selected.id === p.id ? 'ring-1 ring-blue-500' : ''
              }`}
            >
              <button onClick={() => setSelected(p)} className="block w-full text-left">
                <div className="text-base font-medium mb-1 truncate">{p.name}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {p.price.amount} {p.price.currency}
                </div>
                {p.tags && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-zinc-400">צפייה מפורטת</span>
                <Link href={`/products/${p.slug}`} className="text-sm text-blue-400 hover:text-blue-300">
                  לעמוד המוצר →
                </Link>
              </div>
            </div>
          ))}
        </section>

        <ProductViewer product={selected} />

        {selected.description && (
          <p className="text-sm text-zinc-400">{selected.description}</p>
        )}
      </div>
    </main>
  )
}
