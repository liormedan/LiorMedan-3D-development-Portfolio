"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'
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
        <Canvas shadows camera={{ position: [3, 2, 4], fov: 50 }}>
          <color attach="background" args={[0.05, 0.05, 0.06]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <group position={[0, 0.5, 0]}>
            {product.modelPath ? <ProductModel path={product.modelPath} /> : <SpinningProduct />}
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.2} />
          </mesh>
          <Environment preset="city" />
          <OrbitControls makeDefault />
        </Canvas>
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

