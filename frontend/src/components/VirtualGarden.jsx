import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Sprout, TreePine, Flower2, Trees, Skull } from 'lucide-react'

// Plant types based on study duration
const PLANTS = [
  { min: 0, icon: Skull, label: 'Dead', color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800' },
  { min: 15, icon: Sprout, label: 'Sprout', color: 'text-green-400', bg: 'bg-green-50 dark:bg-green-950' },
  { min: 25, icon: Flower2, label: 'Flower', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950' },
  { min: 35, icon: TreePine, label: 'Pine', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  { min: 45, icon: Trees, label: 'Oak', color: 'text-green-700', bg: 'bg-green-50 dark:bg-green-950' },
]

function getPlant(duration, completed) {
  if (!completed) return PLANTS[0] // Dead plant
  for (let i = PLANTS.length - 1; i >= 1; i--) {
    if (duration >= PLANTS[i].min) return PLANTS[i]
  }
  return PLANTS[1]
}

function getGardenData() {
  const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
  return sessions.map((s, i) => ({
    id: i,
    date: s.date,
    duration: s.duration || 0,
    completed: s.completed !== false,
    stressLevel: s.stressLevel,
    plant: getPlant(s.duration || 0, s.completed !== false),
  }))
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const item = {
  hidden: { opacity: 0, scale: 0 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 15 } },
}

export default function VirtualGarden() {
  const garden = useMemo(() => getGardenData(), [])

  const stats = useMemo(() => {
    const alive = garden.filter((g) => g.completed).length
    const dead = garden.filter((g) => !g.completed).length
    return { total: garden.length, alive, dead }
  }, [garden])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">My Study Garden</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Every study session grows a plant. Keep studying to grow your garden!
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{stats.alive}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Alive</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-muted-foreground">{stats.total}</div>
          <div className="text-[10px] text-muted-foreground uppercase">Total</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-3 flex-wrap">
        {PLANTS.slice(1).map((p) => (
          <div key={p.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <p.icon className={`h-3.5 w-3.5 ${p.color}`} />
            <span>{p.label} ({p.min}+ min)</span>
          </div>
        ))}
      </div>

      {/* Garden Grid */}
      {garden.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16">
            <Sprout className="h-16 w-16 text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm">Your garden is empty.</p>
            <p className="text-muted-foreground text-xs">Complete a study session to plant your first seed!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-6 gap-2"
            >
              {garden.map((g) => {
                const Plant = g.plant.icon
                return (
                  <motion.div
                    key={g.id}
                    variants={item}
                    whileHover={{ scale: 1.15, y: -4 }}
                    title={`${new Date(g.date).toLocaleDateString()} — ${g.duration}min ${g.plant.label}`}
                    className={`aspect-square rounded-xl ${g.plant.bg} flex flex-col items-center justify-center gap-0.5 cursor-default transition-shadow hover:shadow-md`}
                  >
                    <Plant className={`h-6 w-6 ${g.plant.color}`} />
                    <span className="text-[8px] text-muted-foreground font-medium">{g.duration}m</span>
                  </motion.div>
                )
              })}
              {/* Empty slots to fill the grid */}
              {Array.from({ length: Math.max(0, 18 - garden.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-xl border border-dashed border-border/50 flex items-center justify-center"
                >
                  <Sprout className="h-4 w-4 text-muted-foreground/15" />
                </div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      )}

      {/* Garden Message */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
        <CardContent className="p-4 text-center">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            {garden.length === 0
              ? 'Plant your first seed by completing a study session!'
              : garden.length < 5
                ? 'Your garden is just starting! Keep studying to grow more plants.'
                : garden.length < 15
                  ? 'Beautiful garden! Each plant represents your dedication.'
                  : 'Incredible garden! You are a true study champion!'}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
