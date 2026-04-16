import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Brain, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function Header({ currentView, onBack }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight">Exam Stress Relief</h1>
            {currentView === 'home' && (
              <p className="text-xs text-muted-foreground">Your calm study companion</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="shrink-0"
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.div>
        </Button>
      </div>
    </motion.header>
  )
}
