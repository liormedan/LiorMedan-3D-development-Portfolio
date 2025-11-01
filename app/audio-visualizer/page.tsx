"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import RightSidebar from '@/components/RightSidebar'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
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

function CircularWaveform({
  sample,
  count,
  theme,
}: {
  sample: () => Uint8Array | null
  count: number
  theme: Theme
}) {
  const groupRef = useRef<THREE.Group>(null)
  const indices = useMemo(() => new Array(count).fill(0).map((_, i) => i), [count])
  const radius = 2.2

  useFrame(() => {
    const data = sample()
    const g = groupRef.current
    if (!data || !g) return
    const len = data.length
    for (let i = 0; i < g.children.length; i++) {
      const idx = Math.min(len - 1, Math.round((i / g.children.length) * len))
      const raw = data[idx]
      const v = raw / 255
      const mesh = g.children[i] as THREE.Mesh
      const target = 0.2 + v * 2.8
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, target, 0.35)
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.color = makeThemeColor(theme, v) as THREE.Color
    }
  })

  return (
    <group ref={groupRef}>
      {indices.map((i) => {
        const a = (i / indices.length) * Math.PI * 2
        const x = Math.cos(a) * radius
        const z = Math.sin(a) * radius
        // mesh faces outward by rotating around Y
        return (
          <group key={i} position={[x, 0.5, z]} rotation={[0, a, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.1, 1, 0.25]} />
              <meshStandardMaterial color="#4f46e5" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function QuantizedPulse({ getTime, bpm, offset, div }: { getTime: () => number; bpm: number; offset: number; div: 1 | 2 | 4 }) {
  const lightRef = useRef<THREE.PointLight>(null)
  useFrame((_, dt) => {
    const t = getTime()
    const beatDur = 60 / Math.max(1, bpm)
    const grid = beatDur / div
    const phase = ((t - offset) % grid + grid) % grid
    // Envelope: sharp at start then decay
    const x = phase / grid
    const pulse = Math.exp(-x * 10)
    const base = 0.4
    if (lightRef.current) lightRef.current.intensity = base + pulse * 1.2
  })
  return <pointLight ref={lightRef} position={[0, 2.8, 1]} intensity={0.6} color="#ffffff" />
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
  const [viewMode, setViewMode] = useState<'bars' | 'circle'>('bars')
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
  const [bpm, setBpm] = useState<number | null>(null)
  const [beatOffset, setBeatOffset] = useState<number>(0)
  const [quantDiv, setQuantDiv] = useState<1 | 2 | 4>(1)

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
      analyzeBpmFromFile(file, ctx).then((val) => {
        setBpm(val)
        setBeatOffset(audioEl.currentTime || 0)
      }).catch(() => {})
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

  // Tone mapping per theme
  const toneMapping = useMemo(() => {
    switch (theme) {
      case 'warm':
        return THREE.CineonToneMapping
      case 'rainbow':
        return THREE.ReinhardToneMapping
      case 'mono':
        return THREE.LinearToneMapping
      case 'cool':
      default:
        return THREE.ACESFilmicToneMapping
    }
  }, [theme])

  // Estimate BPM (autocorrelation on amplitude envelope)
  async function analyzeBpmFromFile(file: File, ctx: AudioContext): Promise<number | null> {
    try {
      const ab = await file.arrayBuffer()
      const decoded = await ctx.decodeAudioData(ab.slice(0))
      const sr = decoded.sampleRate
      const len = decoded.length
      const ch0 = decoded.getChannelData(0)
      const ch1 = decoded.numberOfChannels > 1 ? decoded.getChannelData(1) : null
      const envRate = 200
      const hop = Math.max(1, Math.floor(sr / envRate))
      const frames = Math.floor(len / hop)
      const env = new Float32Array(frames)
      let k = 0
      for (let i = 0; i < len; i += hop) {
        let sum = 0, n = 0
        const end = Math.min(len, i + hop)
        for (let j = i; j < end; j++) { const x = (ch0[j] + (ch1 ? ch1[j] : 0)) * 0.5; sum += Math.abs(x); n++ }
        env[k++] = n ? sum / n : 0
      }
      const mean = env.reduce((a, b) => a + b, 0) / env.length
      for (let i = 0; i < env.length; i++) env[i] = Math.max(0, env[i] - mean)
      let maxv = 1e-6
      for (let i = 0; i < env.length; i++) if (env[i] > maxv) maxv = env[i]
      for (let i = 0; i < env.length; i++) env[i] /= maxv
      const minBpm = 60, maxBpm = 200
      const minLag = Math.floor((envRate * 60) / maxBpm)
      const maxLag = Math.ceil((envRate * 60) / minBpm)
      let bestLag = -1, bestVal = -Infinity
      for (let lag = minLag; lag <= maxLag; lag++) {
        let sum = 0
        for (let i = 0; i + lag < env.length; i++) sum += env[i] * env[i + lag]
        if (sum > bestVal) { bestVal = sum; bestLag = lag }
      }
      if (bestLag <= 0) return null
      let est = (60 * envRate) / bestLag
      while (est < minBpm) est *= 2
      while (est > maxBpm) est /= 2
      return Math.round(est)
    } catch {
      return null
    }
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
        </div>

        <div className="flex flex-col md:flex-row gap-6 text-sm">
          <div className="flex-1">
            <div className="hidden md:block h-0" />
          </div>
          <RightSidebar>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">File</div>
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <span className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-500">Choose file</span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = (e.target as HTMLInputElement).files?.[0]
                      if (f) onFile(f)
                    }}
                  />
                </label>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">View</div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Mode</span>
                  <select className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1" value={mode} onChange={(e)=>setMode(e.target.value as Mode)}>
                    <option value="frequency">Frequency</option>
                    <option value="time">Time Domain</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-400">Bars</span>
                  <div className="flex items-center gap-2 w-40">
                    <input type="range" min={16} max={192} step={1} value={barsCount} onChange={(e)=>setBarsCount(parseInt(e.target.value))} className="flex-1" />
                    <span className="tabular-nums w-8 text-right">{barsCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Theme</span>
                  <select className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1" value={theme} onChange={(e)=>setTheme(e.target.value as Theme)}>
                    <option value="cool">Cool</option>
                    <option value="warm">Warm</option>
                    <option value="rainbow">Rainbow</option>
                    <option value="mono">Mono</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">View Mode</span>
                  <select className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1" value={viewMode} onChange={(e)=>setViewMode(e.target.value as 'bars'|'circle')}>
                    <option value="bars">Bars</option>
                    <option value="circle">Circular</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">Quantize</div>
                <div className="flex items-center gap-2">
                  <select className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1" value={quantDiv} onChange={(e)=>setQuantDiv(Number(e.target.value) as 1|2|4)}>
                    <option value={1}>1/1</option>
                    <option value={2}>1/2</option>
                    <option value={4}>1/4</option>
                  </select>
                  <button className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700" onClick={()=>{const a=audioRef.current;if(a)setBeatOffset(a.audioEl.currentTime||0)}} disabled={!audioRef.current}>Align</button>
                  {bpm && (
                    <div className="flex items-center gap-1">
                      <button className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700" onClick={()=>setBpm(v=>v?Math.max(40,Math.round(v/2)):v)}>÷2</button>
                      <span className="text-zinc-400">BPM {bpm}</span>
                      <button className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700" onClick={()=>setBpm(v=>v?Math.min(240,v*2):v)}>×2</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-zinc-400">Playback</div>
                <button className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 w-full" onClick={togglePlay} disabled={!audioRef.current}>{isPlaying?'Pause':'Play'}</button>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">Vol</span>
                  <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e)=>onVolumeChange(parseFloat(e.target.value))} className="w-full" />
                </div>
              </div>

            </div>
          </RightSidebar>
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
        <Canvas camera={{ position: [0, 2, 6], fov: 50 }} gl={{ toneMapping }}>
          <color attach="background" args={[0.05, 0.05, 0.06]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 5, 3]} intensity={1.2} />
          {viewMode === 'bars' ? (
            <Bars sample={sample} barsCount={barsCount} theme={theme} trailLerp={trailLerp} />
          ) : (
            <CircularWaveform sample={sample} count={barsCount} theme={theme} />
          )}
        {bpm && (
          <QuantizedPulse getTime={() => (audioRef.current?.audioEl.currentTime || 0)} bpm={bpm} offset={beatOffset} div={quantDiv} />
        )}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#111" />
        </mesh>
            {useBloom && (
              <EffectComposer enableNormalPass={false}>
                <Bloom intensity={0.55} luminanceThreshold={0.22} luminanceSmoothing={0.9} mipmapBlur radius={0.65} />
                <ChromaticAberration offset={new THREE.Vector2(0.0005, 0.001)} radialModulation modulationOffset={0.5} blendFunction={BlendFunction.NORMAL} />
                <Vignette eskil={false} offset={0.2} darkness={0.6} />
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
