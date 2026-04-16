import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Home, Coffee } from 'lucide-react'

export default function Completion({ recommendation, onRestart, onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center gap-5 pt-4"
    >
      {/* Animated Checkmark */}
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      >
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(142, 71%, 45%)"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="hsl(142, 71%, 45%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.7 }}
        />
        <motion.path
          d="M30 50 L45 65 L70 35"
          fill="none"
          stroke="hsl(142, 71%, 45%)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        />
      </motion.svg>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold">Great Job!</h2>
        <p className="text-muted-foreground mt-1">You completed your study session</p>
      </motion.div>

      {/* Break Suggestion */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm"
        >
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold text-sm text-green-700">
                  Time for a {recommendation.timer_config.break_minutes}-minute break
                </h4>
              </div>
              <p className="text-sm font-medium">{recommendation.break_recommendation.activity}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {recommendation.break_recommendation.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3 w-full max-w-sm"
      >
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={onGoHome}
        >
          <Home className="h-4 w-4" />
          Home
        </Button>
        <Button
          className="flex-1 gap-2"
          onClick={onRestart}
        >
          <RotateCcw className="h-4 w-4" />
          New Session
        </Button>
      </motion.div>
    </motion.div>
  )
}
