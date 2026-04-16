import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pause, Play, SkipForward, Coffee, BookOpen } from 'lucide-react'
import { apiUrl } from '@/api'
import AmbientSounds from './AmbientSounds'

function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.svg' })
  }
}

export default function StudyTimer({ minutes, breakMinutes, stressLevel, onComplete }) {
  const studySeconds = minutes * 60
  const breakSeconds = (breakMinutes || 5) * 60

  const [phase, setPhase] = useState('study') // 'study' | 'break'
  const [cycle, setCycle] = useState(1)
  const totalCycles = 4
  const currentTotalSeconds = phase === 'study' ? studySeconds : breakSeconds

  const [secondsLeft, setSecondsLeft] = useState(currentTotalSeconds)
  const [isRunning, setIsRunning] = useState(true)
  const [message, setMessage] = useState('')
  const endTimeRef = useRef(Date.now() + currentTotalSeconds * 1000)

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const fetchMessage = useCallback(async () => {
    try {
      const res = await fetch(apiUrl(`/api/messages/${stressLevel}`))
      const data = await res.json()
      setMessage(data.message)
    } catch {
      setMessage('Keep going, you are doing great!')
    }
  }, [stressLevel])

  useEffect(() => {
    fetchMessage()
    const msgInterval = setInterval(fetchMessage, 60000)
    return () => clearInterval(msgInterval)
  }, [fetchMessage])

  const startNextPhase = useCallback((nextPhase, nextCycle) => {
    const nextTotal = nextPhase === 'study' ? studySeconds : breakSeconds
    setPhase(nextPhase)
    setCycle(nextCycle)
    setSecondsLeft(nextTotal)
    endTimeRef.current = Date.now() + nextTotal * 1000
    setIsRunning(true)
  }, [studySeconds, breakSeconds])

  useEffect(() => {
    if (!isRunning) return

    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        if (phase === 'study') {
          if (cycle >= totalCycles) {
            // All cycles done
            sendNotification('All sessions complete!', `You finished ${totalCycles} Pomodoro cycles!`)
            onComplete()
          } else {
            // Switch to break
            sendNotification('Break time!', `Great work! Take a ${breakMinutes || 5}-minute break.`)
            startNextPhase('break', cycle)
          }
        } else {
          // Break over, start next study cycle
          sendNotification('Break over!', `Time for study cycle ${cycle + 1} of ${totalCycles}`)
          startNextPhase('study', cycle + 1)
        }
      }
    }

    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [isRunning, phase, cycle, onComplete, startNextPhase, breakMinutes])

  const togglePause = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      endTimeRef.current = Date.now() + secondsLeft * 1000
      setIsRunning(true)
    }
  }

  const skipPhase = () => {
    if (phase === 'study') {
      if (cycle >= totalCycles) {
        onComplete()
      } else {
        startNextPhase('break', cycle)
      }
    } else {
      startNextPhase('study', cycle + 1)
    }
  }

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const progress = (currentTotalSeconds - secondsLeft) / currentTotalSeconds
  const circumference = 2 * Math.PI * 100
  const dashOffset = circumference * (1 - progress)

  const ringColor = phase === 'study' ? 'hsl(var(--primary))' : 'hsl(142, 71%, 45%)'
  const phaseLabel = phase === 'study' ? 'Studying' : 'Break'
  const PhaseIcon = phase === 'study' ? BookOpen : Coffee

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center gap-5"
    >
      {/* Pomodoro Cycle Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          {Array.from({ length: totalCycles }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i < cycle - 1
                  ? 'bg-green-500'
                  : i === cycle - 1
                    ? phase === 'study' ? 'bg-primary' : 'bg-green-500'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <Badge variant="secondary" className="text-xs gap-1">
          <PhaseIcon className="h-3 w-3" />
          Cycle {cycle}/{totalCycles}
        </Badge>
      </div>

      {/* Phase Label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
            phase === 'study'
              ? 'bg-primary/10 text-primary'
              : 'bg-green-500/10 text-green-600'
          }`}
        >
          {phase === 'study' ? `Study Time (${minutes} min)` : `Break Time (${breakMinutes || 5} min)`}
        </motion.div>
      </AnimatePresence>

      {/* Timer Ring */}
      <div className="relative w-56 h-56">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
          <circle
            cx="110" cy="110" r="100"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="8"
          />
          <circle
            cx="110" cy="110" r="100"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="timer-ring-progress"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={`${mins}-${phase}`}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold tabular-nums tracking-tight"
          >
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </motion.span>
          <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
            {isRunning ? phaseLabel : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant={isRunning ? 'secondary' : 'default'}
          size="lg"
          onClick={togglePause}
          className="gap-2 px-6"
        >
          {isRunning ? (
            <><Pause className="h-4 w-4" /> Pause</>
          ) : (
            <><Play className="h-4 w-4" /> Resume</>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={skipPhase}
          className="gap-2 px-6"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
      </div>

      {/* Ambient Sounds */}
      <AmbientSounds />

      {/* Motivational Message */}
      {message && phase === 'study' && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground italic text-center max-w-xs bg-card rounded-lg p-3 shadow-sm"
        >
          "{message}"
        </motion.p>
      )}
      {phase === 'break' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600 font-medium text-center"
        >
          Relax and recharge for the next cycle
        </motion.p>
      )}
    </motion.div>
  )
}
