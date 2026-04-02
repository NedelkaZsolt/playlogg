import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Wifi, Clock, Volume2, VolumeX, Maximize2 } from 'lucide-react'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
}

function GameSceneBg({ color, sceneType }: { color: string; sceneType: number }) {
  const scenes = [
    // Scene 0: CS2 — warm fire/dust storm
    {
      base: 'linear-gradient(135deg, #0d0c10 0%, #1a1008 40%, #0e0b08 100%)',
      layers: `
        radial-gradient(ellipse 80% 60% at 72% 40%, ${color}55 0%, ${color}18 35%, transparent 65%),
        radial-gradient(ellipse 50% 80% at 15% 85%, rgba(10,15,35,0.9) 0%, transparent 60%),
        radial-gradient(ellipse 30% 40% at 85% 15%, ${color}33 0%, transparent 50%),
        radial-gradient(ellipse 20% 30% at 50% 50%, rgba(255,180,80,0.06) 0%, transparent 60%)
      `,
    },
    // Scene 1: RPG/Vampyr — purple/dark blue moody night
    {
      base: 'linear-gradient(135deg, #080810 0%, #10081a 50%, #080c18 100%)',
      layers: `
        radial-gradient(ellipse 70% 55% at 60% 35%, ${color}44 0%, ${color}15 40%, transparent 65%),
        radial-gradient(ellipse 40% 60% at 10% 80%, rgba(20,10,40,0.8) 0%, transparent 55%),
        radial-gradient(ellipse 25% 35% at 80% 20%, ${color}28 0%, transparent 50%),
        radial-gradient(ellipse 60% 30% at 50% 100%, rgba(5,5,20,0.95) 0%, transparent 50%)
      `,
    },
  ]

  const scene = scenes[sceneType % scenes.length]

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: scene.base }} />
      <div className="absolute inset-0" style={{ background: scene.layers }} />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle 80px at 70% 30%, ${color}20 0%, transparent 100%),
            radial-gradient(circle 50px at 30% 60%, ${color}12 0%, transparent 100%),
            radial-gradient(circle 120px at 80% 70%, ${color}0a 0%, transparent 100%)
          `,
          filter: 'blur(18px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-28"
        style={{ background: 'linear-gradient(to top, #141419 0%, transparent 100%)' }}
      />
    </div>
  )
}

/* Animated "playing" overlay — scanline + color pulse */
function PlayingOverlay({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated color shimmer */}
      <div
        className="absolute inset-0 glow-pulse"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 55% 40%, ${color}18 0%, transparent 70%)`,
        }}
      />
      {/* Scanline sweep */}
      <div
        className="scanline-anim absolute left-0 right-0 h-[30%]"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${color}08 40%, transparent 100%)`,
        }}
      />
      {/* Subtle horizontal CRT lines */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)',
        }}
      />
    </div>
  )
}

export function PostCard({ post }: PostCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted]     = useState(false)
  const [elapsed, setElapsed]     = useState(0)        // seconds
  const [isFullscreen, setIsFullscreen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION = 7200 // 2 hours fake duration

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setElapsed((p) => Math.min(p + 1, DURATION)), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying((p) => !p)
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  const progressPct = (elapsed / DURATION) * 100

  return (
    <div
      className="w-full rounded-xl overflow-hidden cursor-pointer group"
      style={{
        background: '#141419',
        border: `1px solid ${isPlaying ? post.gameColor + '44' : '#1e1e2a'}`,
        boxShadow: isPlaying
          ? `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${post.gameColor}22`
          : '0 4px 24px rgba(0,0,0,0.45)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        if (isPlaying) return
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#282835'
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${post.gameColor}22`
      }}
      onMouseLeave={(e) => {
        if (isPlaying) return
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#1e1e2a'
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.45)'
      }}
    >
      {/* ── Media area ── */}
      <div className="relative h-52 overflow-hidden" onClick={togglePlay}>
        <GameSceneBg color={post.gameColor} sceneType={post.id} />
        {isPlaying && <PlayingOverlay color={post.gameColor} />}

        {/* Centre play/pause */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isPlaying ? 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100' : 'group-hover:scale-110'
            }`}
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              boxShadow: '0 0 0 8px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.6)',
            }}
          >
            {isPlaying
              ? <Pause size={20} className="text-white" fill="white" />
              : <Play  size={22} className="text-white ml-1" fill="white" />
            }
          </div>
        </div>

        {/* Live badge */}
        {post.isLive && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-md"
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.35)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Wifi size={10} style={{ color: '#ef4444' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#ef4444' }}>
              Élő
            </span>
          </div>
        )}

        {/* Game badge */}
        <div
          className="absolute top-3 right-3 px-2 py-1 rounded-md"
          style={{
            background: `${post.gameColor}22`,
            border: `1px solid ${post.gameColor}44`,
            backdropFilter: 'blur(6px)',
          }}
        >
          <span className="text-[10px] font-bold" style={{ color: post.gameColor }}>
            {post.game}
          </span>
        </div>

        {/* ── Player controls bar (shown while playing) ── */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress bar */}
          <div
            className="mx-3 mb-2 h-1 rounded-full overflow-hidden cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            onClick={(e) => {
              e.stopPropagation()
              const rect = e.currentTarget.getBoundingClientRect()
              const ratio = (e.clientX - rect.left) / rect.width
              setElapsed(Math.round(ratio * DURATION))
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, ${post.gameColor} 0%, ${post.gameColor}cc 100%)`,
                boxShadow: `0 0 6px ${post.gameColor}88`,
              }}
            />
          </div>

          {/* Controls row */}
          <div
            className="flex items-center gap-2 px-3 pb-2"
            style={{ background: 'linear-gradient(to top, rgba(10,10,16,0.85) 0%, transparent 100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play/Pause */}
            <button
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}
              onClick={togglePlay}
            >
              {isPlaying
                ? <Pause size={12} className="text-white" fill="white" />
                : <Play  size={12} className="text-white ml-0.5" fill="white" />
              }
            </button>

            {/* Time */}
            <span className="text-[10px] tabular-nums flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {formatTime(elapsed)} / {formatTime(DURATION)}
            </span>

            {/* Mute */}
            <button
              className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/10"
              onClick={() => setIsMuted((m) => !m)}
            >
              {isMuted
                ? <VolumeX size={12} style={{ color: 'rgba(255,255,255,0.5)' }} />
                : <Volume2 size={12} style={{ color: 'rgba(255,255,255,0.7)' }} />
              }
            </button>

            {/* Fullscreen (visual only) */}
            <button
              className="w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-white/10"
              onClick={() => setIsFullscreen((f) => !f)}
            >
              <Maximize2 size={11} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>
          </div>
        </div>

        {/* Static bottom fade (hidden when controls visible) */}
        {!isPlaying && (
          <div
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #141419, transparent)' }}
          />
        )}
      </div>

      {/* ── Info ── */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-tight truncate" style={{ color: '#eaeaf2' }}>
              {post.title}
            </p>
            <p className="text-[12px] mt-1 truncate" style={{ color: '#56566e' }}>
              {post.description}
            </p>
          </div>
          {post.stat && (
            <span
              className="flex-shrink-0 text-[11px] font-bold px-2 py-1 rounded-lg"
              style={{
                background: `${post.gameColor}15`,
                color: post.gameColor,
                border: `1px solid ${post.gameColor}30`,
              }}
            >
              {post.stat}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Clock size={10} style={{ color: '#56566e' }} />
          <span className="text-[11px]" style={{ color: '#56566e' }}>{post.timestamp}</span>
          <span className="text-[11px]" style={{ color: '#282835' }}>•</span>
          <span className="text-[11px]" style={{ color: '#56566e' }}>{post.author}</span>
        </div>
      </div>
    </div>
  )
}
