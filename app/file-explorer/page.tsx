"use client"

import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useCallback, useEffect, useMemo, useState } from 'react'

type DirHandle = any // FileSystemDirectoryHandle (typed as any for cross-browser)
type EntryHandle = any // FileSystemFileHandle | FileSystemDirectoryHandle
type Crumb = { name: string; handle: DirHandle | null }
type FileItem = { name: string; kind: 'file' | 'directory'; handle?: EntryHandle }

function Grid({ items, onOpen }: { items: FileItem[]; onOpen: (it: FileItem) => void }) {
  const positions = useMemo(() => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(items.length || 1)))
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
          <mesh castShadow receiveShadow onClick={() => onOpen(it)}>
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
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ name: 'Root', handle: null }])
  const [hasDirectoryPicker, setHasDirectoryPicker] = useState(false)
  const [isSecure, setIsSecure] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasDirectoryPicker(!!(window as any).showDirectoryPicker)
      setIsSecure(window.isSecureContext)
    }
  }, [])

  const readDirectory = useCallback(async (dirHandle: DirHandle) => {
    const out: FileItem[] = []
    // @ts-ignore - async iterator on FileSystemDirectoryHandle
    for await (const [, handle] of dirHandle.entries()) {
      out.push({ name: handle.name, kind: handle.kind, handle })
    }
    setItems(out)
  }, [])

  const pickDirectory = useCallback(async () => {
    try {
      const anyWin: any = window as any
      if (anyWin.showDirectoryPicker) {
        const dirHandle = await (anyWin as any).showDirectoryPicker()
        await readDirectory(dirHandle)
        setCrumbs([{ name: dirHandle.name || 'Root', handle: dirHandle }])
        setMessage(null)
      } else {
        setMessage('Directory Picker not supported in this browser. Use the fallback input to select a folder or files.')
      }
    } catch (e: any) {
      console.error(e)
      if (e && (e.name === 'NotAllowedError' || e.name === 'AbortError')) {
        setMessage('Permission was denied or the picker was closed. Please try again.')
      } else if (!isSecure) {
        setMessage('Directory Picker requires a secure context (HTTPS or localhost).')
      } else if (e && e.name === 'SecurityError') {
        setMessage('Access was blocked by the browser. Check site permissions and try again.')
      } else {
        setMessage('Failed to open directory. Try the fallback picker below.')
      }
    }
  }, [readDirectory, isSecure])

  const pickFilesFallback = useCallback((files: FileList | null) => {
    if (!files) return
    const out: FileItem[] = []
    for (let i = 0; i < files.length; i++) {
      out.push({ name: files[i]!.name, kind: 'file' })
    }
    setItems(out)
    setCrumbs([{ name: 'Selection', handle: null }])
  }, [])

  const openItem = useCallback(async (it: FileItem) => {
    if (it.kind === 'directory' && it.handle) {
      await readDirectory(it.handle)
      setCrumbs((c) => [...c, { name: it.name, handle: it.handle as DirHandle }])
    }
  }, [readDirectory])

  const navigateToCrumb = useCallback(async (idx: number) => {
    const target = crumbs[idx]
    if (target && target.handle) {
      await readDirectory(target.handle)
      setCrumbs((c) => c.slice(0, idx + 1))
    } else {
      setItems([])
      setCrumbs((c) => c.slice(0, idx + 1))
    }
  }, [crumbs, readDirectory])

  const goUp = useCallback(() => {
    if (crumbs.length > 1) {
      const parentIdx = crumbs.length - 2
      navigateToCrumb(parentIdx)
    }
  }, [crumbs, navigateToCrumb])

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => it.name.toLowerCase().includes(q))
  }, [items, search])

  const dirItems = useMemo(() => filteredItems.filter((it) => it.kind === 'directory'), [filteredItems])

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 flex-wrap justify-between">
          <h1 className="text-2xl font-semibold">File Explorer 3D</h1>
          <div className="flex items-center gap-3">
            <button onClick={pickDirectory} className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500">
              Pick Directory
            </button>
            <label className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
              Pick Files / Directory
              <input
                type="file"
                multiple
                className="hidden"
                // @ts-ignore - vendor attribute for directory picking fallback
                webkitdirectory
                directory
                onChange={(e) => pickFilesFallback(e.target.files)}
              />
            </label>
            <button
              onClick={goUp}
              disabled={crumbs.length <= 1}
              className={`px-3 py-2 rounded-md ${
                crumbs.length <= 1
                  ? 'bg-zinc-700/40 cursor-not-allowed opacity-60'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
              title={crumbs.length <= 1 ? 'Already at root' : 'Go up'}
            >
              Up
            </button>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-sm"
            />
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-zinc-800' : ''}`}
              >
                3D Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-zinc-800' : ''}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <div className="text-xs uppercase tracking-wide text-zinc-400 mb-2">Tree (current)</div>
          <ul className="flex flex-wrap gap-2">
            {dirItems.map((d, i) => (
              <li key={i}>
                <button
                  className="px-2 py-1 text-sm rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                  onClick={() => openItem(d)}
                >
                  {d.name}
                </button>
              </li>
            ))}
            {dirItems.length === 0 && (
              <li className="text-sm text-zinc-500">No subfolders</li>
            )}
          </ul>
        </div>
        {!isSecure && (
          <div className="text-sm text-amber-300/90 bg-amber-950/40 border border-amber-800 rounded p-3">
            Directory Picker requires a secure context. Open this site via HTTPS or localhost.
          </div>
        )}
        {!hasDirectoryPicker && (
          <div className="text-sm text-zinc-300 bg-zinc-900/60 border border-zinc-800 rounded p-3">
            Your browser does not support the Directory Picker API. Use the fallback picker above.
          </div>
        )}
        {message && (
          <div className="text-sm text-rose-300/90 bg-rose-950/40 border border-rose-800 rounded p-3">
            {message}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-zinc-300 flex-wrap">
          <span className="text-zinc-500">Path:</span>
          {crumbs.map((c, i) => (
            <button
              key={i}
              className="underline-offset-2 hover:underline"
              onClick={() => navigateToCrumb(i)}
            >
              {c.name || 'Root'}{i < crumbs.length - 1 ? ' /' : ''}
            </button>
          ))}
          {filteredItems.length > 0 && (
            <span className="text-zinc-500">• {filteredItems.length} items</span>
          )}
        </div>
        {viewMode === 'grid' ? (
          <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
            <Canvas shadows camera={{ position: [4, 4, 8], fov: 50 }}>
              <color attach="background" args={[0.05, 0.05, 0.06]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[4, 6, 3]} intensity={1.2} castShadow />
              <Grid items={filteredItems} onOpen={openItem} />
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="#111" />
              </mesh>
              <OrbitControls makeDefault />
            </Canvas>
          </div>
        ) : (
          <div className="w-full rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
            <ul className="divide-y divide-zinc-800">
              {filteredItems.map((it, i) => (
                <li key={i} className="flex items-center justify-between px-4 py-2 hover:bg-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        it.kind === 'directory' ? 'bg-emerald-400' : 'bg-blue-400'
                      }`}
                    />
                    <span className="truncate max-w-[60vw]">{it.name}</span>
                  </div>
                  {it.kind === 'directory' && (
                    <button
                      className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                      onClick={() => openItem(it)}
                    >
                      Open
                    </button>
                  )}
                </li>
              ))}
              {filteredItems.length === 0 && (
                <li className="px-4 py-6 text-sm text-zinc-400">No items match your search.</li>
              )}
            </ul>
          </div>
        )}
        <p className="text-sm text-zinc-400">
          Use the native Directory Picker for best results. Fallback input allows picking folders in Chromium via webkitdirectory.
          Click green cubes to enter folders. Use the breadcrumb to navigate back.
        </p>
      </div>
    </main>
  )
}
