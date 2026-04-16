import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Flame, Clock, Target, BookCheck, BarChart3,
  Grid3X3, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

function getSessions() {
  return JSON.parse(localStorage.getItem('studySessions') || '[]')
}

function getStreakData() {
  return JSON.parse(localStorage.getItem('streakData') || '{"currentStreak":0,"lastStudyDate":""}')
}

function getTopicsCompleted() {
  const planner = JSON.parse(localStorage.getItem('studyPlanner') || '[]')
  let total = 0
  planner.forEach((s) => s.topics.forEach((t) => { if (t.done) total++ }))
  return total
}

function getDayLabel(dateStr) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[new Date(dateStr).getDay()]
}

// Build heatmap data (last 90 days)
function buildHeatmapData(sessions) {
  const map = {}
  sessions.forEach((s) => {
    const day = s.date.split('T')[0]
    map[day] = (map[day] || 0) + (s.duration || 0)
  })

  const days = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    days.push({ date: key, minutes: map[key] || 0, dayOfWeek: d.getDay() })
  }
  return days
}

function getHeatmapColor(minutes) {
  if (minutes === 0) return 'bg-muted'
  if (minutes < 20) return 'bg-primary/25'
  if (minutes < 40) return 'bg-primary/50'
  if (minutes < 60) return 'bg-primary/75'
  return 'bg-primary'
}

// Build calendar data for a given month
function buildCalendarData(year, month, sessions) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const sessionMap = {}
  sessions.forEach((s) => {
    const day = s.date.split('T')[0]
    if (!sessionMap[day]) sessionMap[day] = { count: 0, minutes: 0, level: null }
    sessionMap[day].count++
    sessionMap[day].minutes += s.duration || 0
    sessionMap[day].level = s.stressLevel
  })

  const weeks = []
  let currentWeek = new Array(firstDay).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
    currentWeek.push({
      day,
      date: dateStr,
      session: sessionMap[dateStr] || null,
      isToday,
    })
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }
  return weeks
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

function AnimatedNumber({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {value}
    </motion.span>
  )
}

const stressColors = { low: 'bg-green-500', medium: 'bg-orange-500', high: 'bg-red-500' }
const stressLabels = { low: 'Low', medium: 'Medium', high: 'High' }
const stressDots = { low: 'bg-green-400', medium: 'bg-orange-400', high: 'bg-red-400' }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function ProgressDashboard() {
  const sessions = useMemo(() => getSessions(), [])
  const streak = useMemo(() => getStreakData(), [])
  const topicsCompleted = useMemo(() => getTopicsCompleted(), [])
  const totalMinutes = useMemo(() => sessions.reduce((sum, s) => sum + (s.duration || 0), 0), [sessions])

  // Calendar state
  const now = new Date()
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [calYear, setCalYear] = useState(now.getFullYear())

  const calendarWeeks = useMemo(() => buildCalendarData(calYear, calMonth, sessions), [calYear, calMonth, sessions])

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) }
    else setCalMonth(calMonth - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) }
    else setCalMonth(calMonth + 1)
  }

  // Weekly chart
  const weeklyData = useMemo(() => {
    const result = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayMinutes = sessions.filter((s) => s.date.startsWith(dateStr)).reduce((sum, s) => sum + (s.duration || 0), 0)
      result.push({ day: getDayLabel(date), minutes: dayMinutes, isToday: i === 0 })
    }
    return result
  }, [sessions])
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1)

  // Heatmap
  const heatmapData = useMemo(() => buildHeatmapData(sessions), [sessions])

  // Recent sessions
  const recentSessions = useMemo(() => [...sessions].reverse().slice(0, 5), [sessions])

  const motivationalMessage = useMemo(() => {
    if (sessions.length === 0) return 'Start your first session to begin tracking!'
    if (streak.currentStreak >= 7) return `Amazing! ${streak.currentStreak}-day streak! You are unstoppable!`
    if (streak.currentStreak >= 3) return `Great momentum! ${streak.currentStreak} days in a row!`
    if (totalMinutes >= 120) return `You've studied ${Math.round(totalMinutes / 60)} hours total. Keep it up!`
    return 'Every session counts. You are making progress!'
  }, [sessions, streak, totalMinutes])

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <motion.div variants={item} className="text-center mb-2">
        <h2 className="text-xl font-bold">My Progress</h2>
        <p className="text-sm text-muted-foreground">Track your study journey</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold"><AnimatedNumber value={sessions.length} /></div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold"><AnimatedNumber value={totalMinutes} /></div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Minutes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <div className="text-2xl font-bold"><AnimatedNumber value={streak.currentStreak} /></div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookCheck className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold"><AnimatedNumber value={topicsCompleted} /></div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider">Topics Done</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Focus Heatmap */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Grid3X3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Focus Heatmap</h3>
              <span className="text-[10px] text-muted-foreground ml-auto">Last 90 days</span>
            </div>
            <div className="flex flex-wrap gap-[3px]">
              {heatmapData.map((d, i) => (
                <motion.div
                  key={d.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.005 }}
                  title={`${d.date}: ${d.minutes}min`}
                  className={`w-[10px] h-[10px] rounded-[2px] ${getHeatmapColor(d.minutes)}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 mt-2 justify-end">
              <span className="text-[9px] text-muted-foreground">Less</span>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-muted" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/25" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/50" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-primary/75" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-primary" />
              <span className="text-[9px] text-muted-foreground">More</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar View */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm flex-1">Study Calendar</h3>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-28 text-center">
                  {MONTHS[calMonth]} {calYear}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-[10px] text-muted-foreground text-center font-medium">
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            {calendarWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((cell, ci) => (
                  <div
                    key={ci}
                    className={`h-9 rounded-md flex flex-col items-center justify-center text-xs relative
                      ${!cell ? '' : cell.isToday ? 'bg-primary/10 ring-1 ring-primary/30' : cell.session ? 'bg-secondary' : 'hover:bg-muted/50'}
                    `}
                  >
                    {cell && (
                      <>
                        <span className={`font-medium ${cell.isToday ? 'text-primary' : cell.session ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {cell.day}
                        </span>
                        {cell.session && (
                          <div className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${stressDots[cell.session.level] || 'bg-primary'}`} />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">This Week</h3>
            </div>
            <div className="flex items-end gap-2 h-28">
              {weeklyData.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full">
                  {day.minutes > 0 && (
                    <span className="text-[10px] font-semibold">{day.minutes}m</span>
                  )}
                  <div className="flex-1 w-full flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((day.minutes / maxMinutes) * 100, day.minutes > 0 ? 8 : 3)}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className={`w-full rounded-t-md ${
                        day.minutes > 0
                          ? day.isToday ? 'bg-primary' : 'bg-primary/60'
                          : 'bg-muted'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-medium ${day.isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div variants={item}>
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Recent Sessions</h3>
            {recentSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No sessions yet. Start studying to see your history!
              </p>
            ) : (
              <div className="space-y-2">
                {recentSessions.map((session, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/50"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${stressColors[session.stressLevel] || 'bg-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stressLabels[session.stressLevel] || 'Unknown'} stress
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">{session.duration}min</Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivation */}
      <motion.div variants={item}>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-medium text-primary">{motivationalMessage}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
