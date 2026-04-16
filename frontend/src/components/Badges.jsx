import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Trophy, Flame, Target, BookCheck, Clock, Zap,
  Star, Award, Crown, Sparkles, Moon, Coffee
} from 'lucide-react'

const BADGES = [
  {
    id: 'first_session',
    name: 'First Step',
    description: 'Complete your first study session',
    icon: Star,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    check: (s) => s.totalSessions >= 1,
    progress: (s) => Math.min(s.totalSessions, 1),
    max: 1,
  },
  {
    id: 'five_sessions',
    name: 'Getting Started',
    description: 'Complete 5 study sessions',
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    check: (s) => s.totalSessions >= 5,
    progress: (s) => Math.min(s.totalSessions, 5),
    max: 5,
  },
  {
    id: 'twenty_sessions',
    name: 'Dedicated Learner',
    description: 'Complete 20 study sessions',
    icon: Award,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    check: (s) => s.totalSessions >= 20,
    progress: (s) => Math.min(s.totalSessions, 20),
    max: 20,
  },
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Reach a 3-day study streak',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    check: (s) => s.streak >= 3,
    progress: (s) => Math.min(s.streak, 3),
    max: 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Reach a 7-day study streak',
    icon: Zap,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    check: (s) => s.streak >= 7,
    progress: (s) => Math.min(s.streak, 7),
    max: 7,
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    description: 'Reach a 30-day study streak',
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    check: (s) => s.streak >= 30,
    progress: (s) => Math.min(s.streak, 30),
    max: 30,
  },
  {
    id: 'hour_studied',
    name: 'Hour Power',
    description: 'Study for a total of 60 minutes',
    icon: Clock,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    check: (s) => s.totalMinutes >= 60,
    progress: (s) => Math.min(s.totalMinutes, 60),
    max: 60,
  },
  {
    id: 'five_hours',
    name: 'Marathon Mind',
    description: 'Study for a total of 5 hours',
    icon: Coffee,
    color: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
    check: (s) => s.totalMinutes >= 300,
    progress: (s) => Math.min(s.totalMinutes, 300),
    max: 300,
  },
  {
    id: 'topics_5',
    name: 'Topic Tamer',
    description: 'Complete 5 topics in the planner',
    icon: BookCheck,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    check: (s) => s.topicsDone >= 5,
    progress: (s) => Math.min(s.topicsDone, 5),
    max: 5,
  },
  {
    id: 'topics_20',
    name: 'Knowledge Master',
    description: 'Complete 20 topics in the planner',
    icon: Sparkles,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    check: (s) => s.topicsDone >= 20,
    progress: (s) => Math.min(s.topicsDone, 20),
    max: 20,
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: Moon,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    check: (s) => s.hasNightSession,
    progress: (s) => s.hasNightSession ? 1 : 0,
    max: 1,
  },
  {
    id: 'all_levels',
    name: 'Well Rounded',
    description: 'Complete sessions at all 3 stress levels',
    icon: Trophy,
    color: 'text-yellow-600',
    bg: 'bg-yellow-500/10',
    check: (s) => s.uniqueLevels >= 3,
    progress: (s) => Math.min(s.uniqueLevels, 3),
    max: 3,
  },
]

function getStats() {
  const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
  const streakData = JSON.parse(localStorage.getItem('streakData') || '{"currentStreak":0}')
  const planner = JSON.parse(localStorage.getItem('studyPlanner') || '[]')

  let topicsDone = 0
  planner.forEach((s) => s.topics.forEach((t) => { if (t.done) topicsDone++ }))

  const uniqueLevels = new Set(sessions.map((s) => s.stressLevel)).size
  const hasNightSession = sessions.some((s) => {
    const hour = new Date(s.date).getHours()
    return hour >= 22 || hour < 5
  })

  return {
    totalSessions: sessions.length,
    totalMinutes: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
    streak: streakData.currentStreak || 0,
    topicsDone,
    uniqueLevels,
    hasNightSession,
  }
}

const XP_PER_BADGE = 50

function getLevel(xp) {
  if (xp >= 500) return { level: 5, name: 'Master', next: null, color: 'text-yellow-500' }
  if (xp >= 350) return { level: 4, name: 'Expert', next: 500, color: 'text-purple-500' }
  if (xp >= 200) return { level: 3, name: 'Advanced', next: 350, color: 'text-blue-500' }
  if (xp >= 100) return { level: 2, name: 'Intermediate', next: 200, color: 'text-green-500' }
  return { level: 1, name: 'Beginner', next: 100, color: 'text-muted-foreground' }
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

export default function Badges() {
  const stats = useMemo(() => getStats(), [])
  const unlockedCount = BADGES.filter((b) => b.check(stats)).length
  const xp = unlockedCount * XP_PER_BADGE
  const levelInfo = getLevel(xp)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <motion.div variants={item} className="text-center mb-2">
        <h2 className="text-xl font-bold">Achievements</h2>
        <p className="text-sm text-muted-foreground">
          {unlockedCount} of {BADGES.length} badges unlocked
        </p>
      </motion.div>

      {/* XP & Level Card */}
      <motion.div variants={item}>
        <Card className="border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${levelInfo.color}`} />
                <span className="font-bold">Level {levelInfo.level}</span>
                <span className={`text-sm font-medium ${levelInfo.color}`}>
                  {levelInfo.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">{xp} XP</span>
            </div>
            {levelInfo.next && (
              <div className="space-y-1">
                <Progress value={(xp / levelInfo.next) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">
                  {levelInfo.next - xp} XP to Level {levelInfo.level + 1}
                </p>
              </div>
            )}
            {!levelInfo.next && (
              <p className="text-xs text-muted-foreground text-center">
                Max level reached! You are a study master!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {BADGES.map((badge) => {
          const unlocked = badge.check(stats)
          const prog = badge.progress(stats)
          const pct = Math.round((prog / badge.max) * 100)
          const Icon = badge.icon

          return (
            <motion.div key={badge.id} variants={item}>
              <Card className={`h-full transition-all ${unlocked ? '' : 'opacity-60'}`}>
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`h-11 w-11 rounded-full ${badge.bg} flex items-center justify-center ${unlocked ? '' : 'grayscale'}`}>
                    <Icon className={`h-5 w-5 ${unlocked ? badge.color : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{badge.name}</h4>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                  {!unlocked && (
                    <div className="w-full space-y-0.5">
                      <Progress value={pct} className="h-1" />
                      <p className="text-[9px] text-muted-foreground">
                        {prog}/{badge.max}
                      </p>
                    </div>
                  )}
                  {unlocked && (
                    <span className="text-[10px] font-semibold text-green-600">Unlocked!</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
