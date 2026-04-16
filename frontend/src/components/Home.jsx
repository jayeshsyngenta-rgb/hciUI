import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  PlayCircle, BookOpen, BarChart3, Wind, Trophy,
  MessageCircle, TreePine, SmilePlus, PenLine, FileDown,
  ChevronRight
} from 'lucide-react'

const mainCard = {
  id: 'session',
  title: 'Start Study Session',
  description: 'Select your stress level and begin a focused study session',
  icon: PlayCircle,
  iconBg: 'bg-primary/10',
  iconColor: 'text-primary',
}

const gridCards = [
  {
    id: 'chat',
    title: 'AI Companion',
    description: 'Chat with AI for tips',
    icon: MessageCircle,
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
  },
  {
    id: 'breathing',
    title: 'Breathing',
    description: 'Guided breathing exercise',
    icon: Wind,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600',
  },
  {
    id: 'planner',
    title: 'Study Planner',
    description: 'Organize subjects',
    icon: BookOpen,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-600',
  },
  {
    id: 'garden',
    title: 'My Garden',
    description: 'Virtual study garden',
    icon: TreePine,
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'progress',
    title: 'Progress',
    description: 'Stats & heatmap',
    icon: BarChart3,
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600',
  },
  {
    id: 'mood',
    title: 'Mood Tracker',
    description: 'Track your mood trends',
    icon: SmilePlus,
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-600',
  },
  {
    id: 'badges',
    title: 'Achievements',
    description: 'Badges & XP levels',
    icon: Trophy,
    iconBg: 'bg-yellow-500/10',
    iconColor: 'text-yellow-600',
  },
  {
    id: 'journal',
    title: 'Journal',
    description: 'Daily study reflections',
    icon: PenLine,
    iconBg: 'bg-sky-500/10',
    iconColor: 'text-sky-600',
  },
  {
    id: 'export',
    title: 'Export Report',
    description: 'Download as PDF',
    icon: FileDown,
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-600',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

export default function Home({ onNavigate }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-4 pt-4"
    >
      <motion.div variants={item} className="text-center mb-1">
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground mt-1 text-sm">What would you like to do today?</p>
      </motion.div>

      {/* Full-width session card */}
      <motion.div variants={item}>
        <Card
          className="cursor-pointer group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border-primary/20"
          onClick={() => onNavigate('session')}
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`h-14 w-14 rounded-xl ${mainCard.iconBg} flex items-center justify-center shrink-0`}>
              <PlayCircle className={`h-7 w-7 ${mainCard.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">{mainCard.title}</h3>
              <p className="text-sm text-muted-foreground">{mainCard.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {gridCards.map((card) => (
          <motion.div key={card.id} variants={item}>
            <Card
              className="cursor-pointer group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full"
              onClick={() => onNavigate(card.id)}
            >
              <CardContent className="flex flex-col items-center text-center gap-1.5 p-3 py-4">
                <div className={`h-10 w-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <h3 className="font-semibold text-[11px] leading-tight">{card.title}</h3>
                <p className="text-[9px] text-muted-foreground leading-tight">{card.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
