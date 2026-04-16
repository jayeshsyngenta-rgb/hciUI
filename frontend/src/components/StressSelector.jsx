import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

const levels = [
  {
    id: 'low',
    label: 'Low Stress',
    description: 'Feeling mostly calm, just slightly anxious',
    emoji: '😌',
    color: 'border-l-green-500 hover:border-green-500/50 hover:bg-green-50',
  },
  {
    id: 'medium',
    label: 'Medium Stress',
    description: 'Feeling nervous and a bit overwhelmed',
    emoji: '😰',
    color: 'border-l-orange-500 hover:border-orange-500/50 hover:bg-orange-50',
  },
  {
    id: 'high',
    label: 'High Stress',
    description: 'Feeling very anxious and under heavy pressure',
    emoji: '😣',
    color: 'border-l-red-500 hover:border-red-500/50 hover:bg-red-50',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
  exit: { opacity: 0, x: -20 },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

export default function StressSelector({ onSelect, isLoading }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col gap-4"
    >
      <motion.div variants={item} className="text-center mb-2">
        <h2 className="text-xl font-bold">How are you feeling?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select your current stress level to get personalized recommendations
        </p>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-12"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Getting your recommendations...</p>
        </motion.div>
      ) : (
        levels.map((level) => (
          <motion.div key={level.id} variants={item}>
            <Card
              className={`cursor-pointer group border-l-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${level.color}`}
              onClick={() => onSelect(level.id)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <span className="text-3xl">{level.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{level.label}</h3>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </motion.div>
  )
}
