import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

const MOODS = [
  { emoji: '😫', label: 'Terrible', value: 1, color: 'bg-red-100 dark:bg-red-950' },
  { emoji: '😟', label: 'Bad', value: 2, color: 'bg-orange-100 dark:bg-orange-950' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-yellow-100 dark:bg-yellow-950' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-lime-100 dark:bg-lime-950' },
  { emoji: '😊', label: 'Great', value: 5, color: 'bg-green-100 dark:bg-green-950' },
]

export { MOODS }

// Standalone mood check component used in session flow
export function MoodCheck({ label, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex gap-2">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.value}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(mood.value)}
            className={`w-12 h-12 rounded-xl ${mood.color} flex flex-col items-center justify-center gap-0.5 border border-transparent hover:border-primary/30 transition-colors`}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="text-[8px] text-muted-foreground">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// Full mood tracker view with history and trends
export default function MoodTracker() {
  const moodHistory = useMemo(() => {
    return JSON.parse(localStorage.getItem('moodHistory') || '[]')
  }, [])

  // Last 14 days trend
  const trendData = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const dayMoods = moodHistory.filter((m) => m.date.startsWith(key))
      const avg = dayMoods.length > 0
        ? dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length
        : null
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
        date: key,
        avg,
        count: dayMoods.length,
        isToday: i === 0,
      })
    }
    return days
  }, [moodHistory])

  const overallAvg = useMemo(() => {
    if (moodHistory.length === 0) return null
    return moodHistory.reduce((sum, m) => sum + m.value, 0) / moodHistory.length
  }, [moodHistory])

  const recentEntries = useMemo(() => {
    return [...moodHistory].reverse().slice(0, 8)
  }, [moodHistory])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Mood Tracker</h2>
        <p className="text-sm text-muted-foreground mt-1">Track how studying affects your mood</p>
      </div>

      {/* Average Mood */}
      {overallAvg && (
        <Card className="border-primary/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Mood</p>
              <p className="text-2xl font-bold">{MOODS[Math.round(overallAvg) - 1]?.emoji} {overallAvg.toFixed(1)}/5</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Check-ins</p>
              <p className="text-2xl font-bold">{moodHistory.length}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Trend Chart */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">14-Day Mood Trend</h3>
          </div>
          <div className="flex items-end gap-1 h-32">
            {trendData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                <div className="flex-1 w-full flex items-end justify-center">
                  {day.avg !== null ? (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.avg / 5) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.03 }}
                      className={`w-full max-w-6 rounded-t-md ${
                        day.avg >= 4 ? 'bg-green-500' :
                        day.avg >= 3 ? 'bg-yellow-500' :
                        day.avg >= 2 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    />
                  ) : (
                    <div className="w-full max-w-6 h-1 rounded bg-muted" />
                  )}
                </div>
                <span className={`text-[8px] font-medium ${day.isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[9px] text-muted-foreground">😫 Low</span>
            <span className="text-[9px] text-muted-foreground">High 😊</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3">Recent Check-ins</h3>
          {recentEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No mood data yet. Complete a study session to log your first mood!
            </p>
          ) : (
            <div className="space-y-2">
              {recentEntries.map((entry, i) => {
                const mood = MOODS[entry.value - 1]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
                  >
                    <span className="text-lg">{mood?.emoji}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{mood?.label}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {entry.type === 'before' ? 'Before session' : 'After session'} — {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
