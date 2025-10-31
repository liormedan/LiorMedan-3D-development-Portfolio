"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useCallback, useMemo, useRef, useState } from 'react'

type AudioStuff = {
  ctx: AudioContext
  source: MediaElementAudioSourceNode
  analyser: AnalyserNode
  dataArray: Uint8Array
  audioEl: HTMLAudioElement
}

function Bars({ getData }: { getData: () => Uint8Array | null }) {
  const group = useRef<THREE.Group>(null)
  const bars = useMemo(() => new Array(64).fill(0), [])

  useFrame(() => {
    const data = getData()
    if (!data || !group.current) return
    for (let i = 0; i < group.current.children.length; i++) {
      const v = data[i] / 255
      const mesh = group.current.children[i] as THREE.Mesh
      const scaleY = 0.2 + v * 3
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, scaleY, 0.25)
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.color.setHSL(0.6 - v * 0.6, 0.7, 0.5 + v * 0.3)
    }
  })

  return (
    <group ref={group}>
      {bars.map((_, i) => (
        <mesh key={i} position={[i * 0.25 - (bars.length * 0.25) / 2, 0.5, 0]}>
          <boxGeometry args={[0.2, 1, 0.2]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
      ))}
    </group>
  )
}

export default function AudioVisualizerPage() {
  const audioRef = useRef<AudioStuff | null>(null)
  const [, setTick] = useState(0)

  const getData = useCallback(() => {
    const a = audioRef.current
    if (!a) return null
    // TS lib mismatch: AnalyserNode expects Uint8Array<ArrayBuffer>
    // while our instance is inferred as Uint8Array<ArrayBufferLike>.
    // Cast to satisfy DOM signature across TS versions.
    a.analyser.getByteFrequencyData(a.dataArray as unknown as Uint8Array)
    return a.dataArray
  }, [])

  const onFile = async (file: File) => {
    try {
      const url = URL.createObjectURL(file)
      const audioEl = new Audio(url)
      audioEl.loop = true
      await audioEl.play().catch(() => {/* user gesture required */})

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = ctx.createMediaElementSource(audioEl)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      const dataArray = new Uint8Array(analyser.frequencyBinCount) as unknown as Uint8Array
      source.connect(analyser)
      analyser.connect(ctx.destination)
      audioRef.current = { ctx, source, analyser, dataArray, audioEl }
      setTick((t) => t + 1)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold">הדמיית גלי קול</h1>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-zinc-300">בחרו קובץ אודיו</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onFile(f)
              }}
            />
            <span className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500">טעינה</span>
          </label>
        </div>
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
          <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
            <color attach="background" args={[0.05, 0.05, 0.06]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 5, 3]} intensity={1.2} />
            <Bars getData={getData} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <OrbitControls makeDefault />
          </Canvas>
        </div>
        <p className="text-sm text-zinc-400">מומלץ קבצי MP3/WAV. ההשמעה בלולאה לצורך המחשה.</p>
      </div>
    </main>
  )
}
