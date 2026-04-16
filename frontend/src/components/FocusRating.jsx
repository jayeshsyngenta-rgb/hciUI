import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function FocusRating({ onRate }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)

  const handleClick = (rating) => {
    setSelected(rating)
    // Save to localStorage
    const scores = JSON.parse(localStorage.getItem('focusScores') || '[]')
    scores.push({ date: new Date().toISOString(), score: rating })
    localStorage.setItem('focusScores', JSON.stringify(scores))
    setTimeout(() => onRate(rating), 500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-3"
    >
      <p className="text-sm font-medium text-muted-foreground">How focused were you?</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleClick(star)}
            className="p-1"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hovered || selected)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          </motion.button>
        ))}
      </div>
      {(hovered || selected) > 0 && (
        <p className="text-xs text-muted-foreground">
          {['', 'Very distracted', 'Somewhat distracted', 'Average focus', 'Good focus', 'Laser focused!'][hovered || selected]}
        </p>
      )}
    </motion.div>
  )
}
