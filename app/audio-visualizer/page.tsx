"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'

type Mode = 'frequency' | 'time'
type Theme = 'cool' | 'warm' | 'rainbow' | 'mono'

type AudioStuff = {
  ctx: AudioContext
  source: MediaElementAudioSourceNode
  analyser: AnalyserNode
  buffer: Uint8Array
  audioEl: HTMLAudioElement
  url: string
}

function nearestPow2(n: number) {
  return Math.pow(2, Math.max(5, Math.min(11, Math.ceil(Math.log2(Math.max(32, Math.min(2048, n)))))))
}

function makeThemeColor(theme: Theme, v: number): THREE.ColorRepresentation {
  const c = new THREE.Color()
  switch (theme) {
    case 'cool':
      c.setHSL(0.6 - v * 0.5, 0.7, 0.45 + v * 0.35)
      break
    case 'warm':
      c.setHSL(0.05 + v * 0.1, 0.8, 0.5 + v * 0.3)
      break
    case 'rainbow':
      c.setHSL((0.8 + v) % 1, 0.85, 0.5)
      break
    case 'mono':
    default:
      c.setScalar(0.3 + v * 0.7)
      break
  }
  return c
}

function Bars({
  sample,
  barsCount,
  theme,
  trailLerp,
}: {
  sample: () => Uint8Array | null
  barsCount: number
  theme: Theme
  trailLerp: number
}) {
  const barsGroup = useRef<THREE.Group>(null)
  const trailGroup = useRef<THREE.Group>(null)
  const indices = useMemo(() => new Array(barsCount).fill(0).map((_, i) => i), [barsCount])
  const xSpacing = 0.22
  const half = (indices.length * xSpacing) / 2

  useFrame(() => {
    const data = sample()
    if (!data || !barsGroup.current) return
    const len = data.length
    for (let i = 0; i < indices.length; i++) {
      const idx = Math.min(len - 1, Math.round((i / indices.length) * len))
      const raw = data[idx]
      const v = raw / 255
      const mesh = barsGroup.current.children[i] as THREE.Mesh
      const target = 0.2 + v * 3.2
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, target, 0.35)
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.color = makeThemeColor(theme, v) as THREE.Color

      if (trailGroup.current) {
        const tmesh = trailGroup.current.children[i] as THREE.Mesh
        const tMat = tmesh.material as THREE.MeshStandardMaterial
        tmesh.scale.y = THREE.MathUtils.lerp(tmesh.scale.y, mesh.scale.y, trailLerp)
        tMat.opacity = 0.35
      }
    }
  })

  return (
    <group>
      <group ref={trailGroup}>
        {indices.map((i) => (
          <mesh key={`trail-${i}`} position={[i * xSpacing - half, 0.5, -0.03]}> 
            <boxGeometry args={[0.18, 1, 0.18]} />
            <meshStandardMaterial color="#111" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>
      <group ref={barsGroup}>
        {indices.map((i) => (
          <mesh key={`bar-${i}`} position={[i * xSpacing - half, 0.5, 0]}>
            <boxGeometry args={[0.18, 1, 0.18]} />
            <meshStandardMaterial color="#4f46e5" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function AudioVisualizerPage() {
  const audioRef = useRef<AudioStuff | null>(null)
  const [, setTick] = useState(0)

  const [mode, setMode] = useState<Mode>('frequency')
  const [barsCount, setBarsCount] = useState<number>(64)
  const [theme, setTheme] = useState<Theme>('cool')
  const [useBloom, setUseBloom] = useState<boolean>(true)
  const [trailLerp, setTrailLerp] = useState<number>(0.08)
  const [fileName, setFileName] = useState<string>('')
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(1)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const ensureFftForBars = useCallback((desiredBars: number) => {
    const a = audioRef.current
    if (!a) return
    const desiredFft = nearestPow2(desiredBars * 2)
    if (a.analyser.fftSize !== desiredFft) {
      a.analyser.fftSize = desiredFft
      a.buffer = new Uint8Array(a.analyser.frequencyBinCount) as unknown as Uint8Array<ArrayBuffer>
    }
  }, [])

  useEffect(() => {
    ensureFftForBars(barsCount)
  }, [barsCount, ensureFftForBars])

  const sample = useCallback(() => {
    const a = audioRef.current
    if (!a) return null
    if (mode === 'frequency') {
      a.analyser.getByteFrequencyData(a.buffer as unknown as Uint8Array<ArrayBuffer>)
    } else {
      a.analyser.getByteTimeDomainData(a.buffer as unknown as Uint8Array<ArrayBuffer>)
      // Convert 0..255 with mid=128 to magnitude-like 0..255 to keep mapping similar
      for (let i = 0; i < a.buffer.length; i++) {
        const d = Math.abs(a.buffer[i] - 128)
        a.buffer[i] = Math.min(255, d * 2)
      }
    }
    return a.buffer
  }, [mode])

  const onFile = async (file: File) => {
    try {
      // cleanup previous
      if (audioRef.current) {
        try { audioRef.current.audioEl.pause() } catch {}
        try { audioRef.current.source.disconnect() } catch {}
        try { audioRef.current.analyser.disconnect() } catch {}
        try { URL.revokeObjectURL(audioRef.current.url) } catch {}
      }
      const url = URL.createObjectURL(file)
      const audioEl = new Audio(url)
      audioEl.loop = true
      audioEl.preload = 'metadata'
      audioEl.volume = volume
      audioEl.addEventListener('loadedmetadata', () => {
        setDuration(Number.isFinite(audioEl.duration) ? audioEl.duration : 0)
      })
      audioEl.addEventListener('timeupdate', () => {
        setCurrentTime(audioEl.currentTime)
      })
      await audioEl.play().catch(() => {/* user gesture required */})

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = ctx.createMediaElementSource(audioEl)
      const analyser = ctx.createAnalyser()
      analyser.smoothingTimeConstant = 0.7
      analyser.fftSize = nearestPow2(barsCount * 2)
      const buffer = new Uint8Array(analyser.frequencyBinCount) as unknown as Uint8Array<ArrayBuffer>
      source.connect(analyser)
      analyser.connect(ctx.destination)
      audioRef.current = { ctx, source, analyser, buffer, audioEl, url }
      setFileName(file.name)
      setIsPlaying(!audioEl.paused)
      setTick((t) => t + 1)
    } catch (e) {
      console.error(e)
    }
  }

  const togglePlay = async () => {
    const a = audioRef.current
    if (!a) return
    if (a.audioEl.paused) {
      try { await a.ctx.resume() } catch {}
      await a.audioEl.play().catch(() => {})
      setIsPlaying(true)
    } else {
      a.audioEl.pause()
      setIsPlaying(false)
    }
  }

  const onSeek = (t: number) => {
    const a = audioRef.current
    if (!a) return
    a.audioEl.currentTime = t
    setCurrentTime(t)
  }

  const onVolumeChange = (v: number) => {
    const a = audioRef.current
    setVolume(v)
    if (!a) return
    a.audioEl.volume = v
  }

  const fmt = (s: number) => {
    if (!Number.isFinite(s) || s < 0) s = 0
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      const a = audioRef.current
      if (!a) return
      try { a.audioEl.pause() } catch {}
      try { a.source.disconnect() } catch {}
      try { a.analyser.disconnect() } catch {}
      try { URL.revokeObjectURL(a.url) } catch {}
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = audioRef.current
      if (!a) return
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onSeek(Math.min((duration || 0), (a.audioEl.currentTime || 0) + 5))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onSeek(Math.max(0, (a.audioEl.currentTime || 0) - 5))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        onVolumeChange(Math.min(1, volume + 0.05))
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onVolumeChange(Math.max(0, volume - 0.05))
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault()
        onVolumeChange(volume > 0 ? 0 : 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, onSeek, onVolumeChange, duration, volume])

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-semibold">Audio Visualizer</h1>
          <label className="inline-flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-zinc-300">Load audio (MP3/WAV)</span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onFile(f)
              }}
            />
            <span className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500">Choose file</span>
          </label>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Mode</span>
            <select
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="frequency">Frequency</option>
              <option value="time">Time Domain</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Bars</span>
            <input
              type="range"
              min={16}
              max={192}
              step={1}
              value={barsCount}
              onChange={(e) => setBarsCount(parseInt(e.target.value))}
            />
            <span className="tabular-nums w-10 text-right">{barsCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Theme</span>
            <select
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value="cool">Cool</option>
              <option value="warm">Warm</option>
              <option value="rainbow">Rainbow</option>
              <option value="mono">Mono</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" className="accent-purple-500" checked={useBloom} onChange={(e) => setUseBloom(e.target.checked)} />
            <span className="text-zinc-400">Bloom</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Trail</span>
            <input
              type="range"
              min={0}
              max={0.3}
              step={0.01}
              value={trailLerp}
              onChange={(e) => setTrailLerp(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div
          className={`w-full aspect-[16/9] rounded-lg overflow-hidden border ${isDragOver ? 'border-purple-500' : 'border-zinc-800'} bg-zinc-900 relative`}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setIsDragOver(false)
            const f = e.dataTransfer?.files?.[0]
            if (f) onFile(f)
          }}
        >
          {isDragOver && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
              <div className="px-4 py-2 rounded-md border border-purple-500 text-purple-300 bg-black/30">Drop audio file</div>
            </div>
          )}
          <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
            <color attach="background" args={[0.05, 0.05, 0.06]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 5, 3]} intensity={1.2} />
            <Bars sample={sample} barsCount={barsCount} theme={theme} trailLerp={trailLerp} />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            {useBloom && (
              <EffectComposer>
                <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
              </EffectComposer>
            )}
            <OrbitControls makeDefault />
          </Canvas>
        </div>
        <div className="flex items-center gap-4 text-sm flex-wrap">
          <button
            className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700"
            onClick={togglePlay}
            disabled={!audioRef.current}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="flex items-center gap-2 grow min-w-[220px]">
            <span className="text-zinc-400 w-24 truncate" title={fileName || 'No file'}>
              {fileName || 'No file'}
            </span>
            <input
              className="flex-1"
              type="range"
              min={0}
              max={Math.max(0, duration) || 0}
              step={0.01}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              disabled={!audioRef.current || !duration}
            />
            <span className="tabular-nums w-16 text-right text-zinc-400">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Vol</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-28"
            />
          </div>
        </div>
        <p className="text-sm text-zinc-400">Drag & drop or choose an audio file. Control playback, seek, and volume.</p>
      </div>
    </main>
  )
}
