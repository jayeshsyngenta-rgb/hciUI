import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CloudRain, Music, Leaf, VolumeX, Volume2 } from 'lucide-react'

import rainSound from '@/assets/sounds/rain.mp3'
import lofiSound from '@/assets/sounds/lofi.mp3'
import natureSound from '@/assets/sounds/nature.mp3'

const SOUNDS = [
  { id: 'rain', name: 'Rain', Icon: CloudRain, src: rainSound },
  { id: 'lofi', name: 'Lo-Fi', Icon: Music, src: lofiSound },
  { id: 'nature', name: 'Nature', Icon: Leaf, src: natureSound },
  { id: 'silence', name: 'Silence', Icon: VolumeX, src: null },
]

export default function AmbientSounds() {
  const [activeSound, setActiveSound] = useState('silence')
  const [volume, setVolume] = useState(80)
  const audioRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playSound = useCallback((soundId) => {
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }

    setActiveSound(soundId)

    if (soundId === 'silence') return

    const sound = SOUNDS.find((s) => s.id === soundId)
    if (!sound?.src) return

    const audio = new Audio(sound.src)
    audio.loop = true
    audio.volume = volume / 100
    audio.play().catch(() => {})
    audioRef.current = audio
  }, [volume])

  const handleVolumeChange = useCallback((e) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) {
      audioRef.current.volume = v / 100
    }
  }, [])

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        Ambient Sound
      </span>

      {/* Sound pills */}
      <div className="flex gap-2 flex-wrap justify-center">
        {SOUNDS.map((s) => (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => playSound(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
              ${activeSound === s.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              }`}
          >
            <s.Icon className="h-3.5 w-3.5" />
            {s.name}
          </motion.button>
        ))}
      </div>

      {/* Volume slider -- always rendered to avoid unmount issues */}
      <div
        className="flex items-center gap-3 w-52 transition-opacity duration-200"
        style={{ opacity: activeSound !== 'silence' ? 1 : 0.3, pointerEvents: activeSound !== 'silence' ? 'auto' : 'none' }}
      >
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 appearance-none bg-muted rounded-full cursor-pointer accent-primary
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-primary
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-primary
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <span className="text-xs text-muted-foreground w-7 text-right tabular-nums">{volume}%</span>
      </div>
    </div>
  )
}
