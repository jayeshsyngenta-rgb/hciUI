import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Square, RotateCcw } from 'lucide-react'

const PHASES = [
  { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly...', color: 'hsl(210, 70%, 55%)' },
  { name: 'Hold', duration: 7, instruction: 'Hold your breath...', color: 'hsl(260, 60%, 55%)' },
  { name: 'Exhale', duration: 8, instruction: 'Breathe out slowly...', color: 'hsl(170, 60%, 45%)' },
]

const PRESETS = [
  { name: '4-7-8 Relaxing', phases: [4, 7, 8], description: 'Best for calming anxiety' },
  { name: 'Box Breathing', phases: [4, 4, 4], description: 'Equal timing for focus' },
  { name: 'Quick Calm', phases: [3, 3, 6], description: 'Fast stress relief' },
]

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseTime, setPhaseTime] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [selectedPreset, setSelectedPreset] = useState(0)
  const intervalRef = useRef(null)

  const preset = PRESETS[selectedPreset]
  const phases = PHASES.map((p, i) => ({ ...p, duration: preset.phases[i] }))
  const phase = phases[currentPhase]
  const totalPhaseDuration = phase.duration
  const progress = phaseTime / totalPhaseDuration

  useEffect(() => {
    if (!isActive) return

    intervalRef.current = setInterval(() => {
      setPhaseTime((prev) => {
        if (prev + 1 >= totalPhaseDuration) {
          // Move to next phase
          setCurrentPhase((cp) => {
            const next = (cp + 1) % 3
            if (next === 0) {
              setCycleCount((c) => c + 1)
            }
            return next
          })
          return 0
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isActive, totalPhaseDuration])

  const start = () => {
    setIsActive(true)
    setCurrentPhase(0)
    setPhaseTime(0)
    setCycleCount(0)
  }

  const stop = () => {
    setIsActive(false)
    clearInterval(intervalRef.current)
  }

  const reset = () => {
    stop()
    setCurrentPhase(0)
    setPhaseTime(0)
    setCycleCount(0)
  }

  // Scale: 1.0 at rest, grows to 1.5 on inhale, stays 1.5 on hold, shrinks to 1.0 on exhale
  const getScale = () => {
    if (!isActive) return 1
    if (currentPhase === 0) return 1 + 0.5 * progress // Inhale: 1 -> 1.5
    if (currentPhase === 1) return 1.5 // Hold
    return 1.5 - 0.5 * progress // Exhale: 1.5 -> 1
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Breathing Exercise</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Calm your mind with guided breathing
        </p>
      </div>

      {/* Preset Selector */}
      {!isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 flex-wrap justify-center"
        >
          {PRESETS.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedPreset(i)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all
                ${selectedPreset === i
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="opacity-70">{p.phases.join('-')}-{p.phases[2]}</div>
            </button>
          ))}
        </motion.div>
      )}

      {/* Breathing Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer glow rings */}
        <motion.div
          animate={{
            scale: isActive ? getScale() * 1.15 : 1.15,
            opacity: isActive ? 0.15 : 0.05,
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute w-48 h-48 rounded-full"
          style={{ backgroundColor: isActive ? phase.color : 'hsl(210, 70%, 55%)' }}
        />
        <motion.div
          animate={{
            scale: isActive ? getScale() * 1.08 : 1.08,
            opacity: isActive ? 0.25 : 0.1,
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute w-48 h-48 rounded-full"
          style={{ backgroundColor: isActive ? phase.color : 'hsl(210, 70%, 55%)' }}
        />

        {/* Main circle */}
        <motion.div
          animate={{
            scale: getScale(),
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl"
          style={{
            background: isActive
              ? `radial-gradient(circle, ${phase.color}dd, ${phase.color}88)`
              : 'radial-gradient(circle, hsl(210, 70%, 55%, 0.8), hsl(210, 70%, 55%, 0.5))',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isActive ? phase.name : 'ready'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center text-white"
            >
              <div className="text-2xl font-bold">
                {isActive ? phase.name : 'Ready'}
              </div>
              <div className="text-sm opacity-80 mt-1">
                {isActive ? `${totalPhaseDuration - phaseTime}s` : 'Tap Start'}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Instruction */}
      {isActive && (
        <motion.p
          key={phase.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground italic"
        >
          {phase.instruction}
        </motion.p>
      )}

      {/* Cycle counter */}
      {isActive && cycleCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          Cycle {cycleCount} completed
        </motion.div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isActive ? (
          <Button onClick={start} size="lg" className="gap-2 px-8">
            <Play className="h-4 w-4" />
            Start Breathing
          </Button>
        ) : (
          <>
            <Button onClick={stop} variant="secondary" size="lg" className="gap-2">
              <Square className="h-4 w-4" />
              Stop
            </Button>
            <Button onClick={reset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Info Card */}
      {!isActive && (
        <Card className="w-full max-w-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">{preset.name}</span> ({preset.phases.join('s - ')}s) -- {preset.description}.
              Complete 3-4 cycles for best results.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}
