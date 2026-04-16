import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Coffee, Quote, Play } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
  exit: { opacity: 0, x: -20 },
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

export default function Suggestion({ data, onStartTimer }) {
  if (!data) return null

  const { break_recommendation, timer_config, motivational_message } = data

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
      className="flex flex-col gap-4"
    >
      {/* Motivational Quote */}
      <motion.div variants={item}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex gap-3 p-5">
            <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-primary italic leading-relaxed">
              "{motivational_message}"
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timer Configuration */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Recommended Session</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{timer_config.study_minutes}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Study Minutes
                </div>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{timer_config.break_minutes}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                  Break Minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Break Recommendation */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Break Activity</h3>
            </div>
            <p className="font-medium">{break_recommendation.activity}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {break_recommendation.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Start Timer Button */}
      <motion.div variants={item}>
        <Button
          size="lg"
          className="w-full h-14 text-base font-semibold gap-2 shadow-lg shadow-primary/20"
          onClick={onStartTimer}
        >
          <Play className="h-5 w-5" />
          Start Study Timer
        </Button>
      </motion.div>
    </motion.div>
  )
}
