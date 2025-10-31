"use client"

import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useCallback, useMemo, useState } from 'react'

type FileItem = { name: string; kind: 'file' | 'directory' }

function Grid({ items }: { items: FileItem[] }) {
  const positions = useMemo(() => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(items.length)))
    return items.map((_, i) => {
      const x = i % cols
      const y = Math.floor(i / cols)
      return [(x - cols / 2) * 1.5, 0.6, -y * 1.5] as [number, number, number]
    })
  }, [items])

  return (
    <group>
      {items.map((it, i) => (
        <group position={positions[i]} key={i}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={it.kind === 'directory' ? '#34d399' : '#60a5fa'} />
          </mesh>
          <Html center distanceFactor={8} position={[0, 0.9, 0]} wrapperClass="select-none">
            <div className="px-2 py-1 text-xs bg-black/70 rounded border border-zinc-700 max-w-[180px] truncate">
              {it.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

export default function FileExplorer3D() {
  const [items, setItems] = useState<FileItem[]>([])

  const pickDirectory = useCallback(async () => {
    try {
      const anyWin: any = window as any
      if (anyWin.showDirectoryPicker) {
        const dirHandle = await (anyWin as any).showDirectoryPicker()
        const out: FileItem[] = []
        // @ts-ignore - async iterator on FileSystemDirectoryHandle
        for await (const [, handle] of dirHandle.entries()) {
          out.push({ name: handle.name, kind: handle.kind })
        }
        setItems(out)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const pickFilesFallback = useCallback((files: FileList | null) => {
    if (!files) return
    const out: FileItem[] = []
    for (let i = 0; i < files.length; i++) {
      out.push({ name: files[i]!.name, kind: 'file' })
    }
    setItems(out)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 flex-wrap justify-between">
          <h1 className="text-2xl font-semibold">סייר קבצים 3D</h1>
          <div className="flex items-center gap-3">
            <button onClick={pickDirectory} className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500">
              בחירת תיקייה
            </button>
            <label className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
              או בחרו קבצים
              <input
                type="file"
                multiple
                className="hidden"
                // @ts-ignore - non-standard webkitdirectory attribute when desired
                onChange={(e) => pickFilesFallback(e.target.files)}
              />
            </label>
          </div>
        </div>
        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
          <Canvas shadows camera={{ position: [4, 4, 8], fov: 50 }}>
            <color attach="background" args={[0.05, 0.05, 0.06]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
            <Grid items={items} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <OrbitControls makeDefault />
          </Canvas>
        </div>
        <p className="text-sm text-zinc-400">בדפדפנים תומכים, שימוש ב־Directory Picker מעניק שמות פריטים מהתיקייה.
          חלופה: בחירת קבצים ידנית.</p>
      </div>
    </main>
  )
}

