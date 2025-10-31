"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useRef, useState, useCallback } from 'react'

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

export default function ProductsPage() {
  const sceneRef = useRef<THREE.Scene | null>(null)
  const [exporting, setExporting] = useState(false)

  const onCreated = useCallback(({ scene }: { scene: THREE.Scene }) => {
    sceneRef.current = scene
  }, [])

  const handleExport = async () => {
    if (!sceneRef.current || exporting) return
    setExporting(true)
    try {
      const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
      const exporter = new GLTFExporter()
      exporter.parse(
        sceneRef.current,
        (gltf) => {
          const json = JSON.stringify(gltf)
          const blob = new Blob([json], { type: 'model/gltf+json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'product.gltf'
          a.click()
          URL.revokeObjectURL(url)
          setExporting(false)
        },
        { binary: false }
      )
    } catch (e) {
      console.error(e)
      setExporting(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">מוצרים בתלת־ממד</h1>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
          >
            {exporting ? 'מייצא…' : 'הורדת דגם (GLTF)'}
          </button>
        </div>
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
          <Canvas
            shadows
            camera={{ position: [3, 2, 4], fov: 50 }}
            onCreated={onCreated}
          >
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
              <SpinningProduct />
            </group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
              <planeGeometry args={[20, 20]} />
              <shadowMaterial opacity={0.2} />
            </mesh>
            <Environment preset="city" />
            <OrbitControls makeDefault />
          </Canvas>
        </div>
        <p className="text-sm text-zinc-400">
          זהו דגם דמו. ניתן להחליף בדגמי GLB/GLTF אמיתיים בהמשך.
        </p>
      </div>
    </main>
  )
}

