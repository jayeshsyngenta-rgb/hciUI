import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, Target, Clock, Flame, BookCheck, Star } from 'lucide-react'

function getData() {
  const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
  const streak = JSON.parse(localStorage.getItem('streakData') || '{"currentStreak":0}')
  const planner = JSON.parse(localStorage.getItem('studyPlanner') || '[]')
  const moods = JSON.parse(localStorage.getItem('moodHistory') || '[]')
  const focusScores = JSON.parse(localStorage.getItem('focusScores') || '[]')

  let topicsDone = 0, topicsTotal = 0
  planner.forEach((s) => { topicsTotal += s.topics.length; s.topics.forEach((t) => { if (t.done) topicsDone++ }) })

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
  const avgFocus = focusScores.length > 0
    ? (focusScores.reduce((sum, f) => sum + f.score, 0) / focusScores.length).toFixed(1)
    : 'N/A'
  const avgMood = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.value, 0) / moods.length).toFixed(1)
    : 'N/A'

  return {
    sessions: sessions.length,
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    streak: streak.currentStreak || 0,
    topicsDone,
    topicsTotal,
    avgFocus,
    avgMood,
    subjects: planner.map((s) => ({
      name: s.subject,
      done: s.topics.filter((t) => t.done).length,
      total: s.topics.length,
    })),
    recentSessions: [...sessions].reverse().slice(0, 10),
  }
}

export default function ExportReport() {
  const data = useMemo(() => getData(), [])

  const handleExport = () => {
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Study Progress Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; color: #4a90d9; margin-bottom: 4px; }
    .subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
    .date { color: #999; font-size: 12px; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
    .stat { background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center; }
    .stat-value { font-size: 32px; font-weight: 700; color: #4a90d9; }
    .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    h2 { font-size: 18px; margin: 28px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e8f0fe; color: #2d3748; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { background: #f8f9fa; padding: 10px 12px; text-align: left; font-weight: 600; color: #555; }
    td { padding: 8px 12px; border-bottom: 1px solid #eee; }
    .progress-bar { background: #e2e8f0; border-radius: 4px; height: 8px; overflow: hidden; }
    .progress-fill { background: #48bb78; height: 100%; border-radius: 4px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #aaa; }
    .highlight { color: #4a90d9; font-weight: 600; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Study Progress Report</h1>
  <p class="subtitle">Exam Stress Relief — Your Study Journey</p>
  <p class="date">Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

  <div class="stats">
    <div class="stat">
      <div class="stat-value">${data.sessions}</div>
      <div class="stat-label">Sessions</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.totalHours}h</div>
      <div class="stat-label">Study Time</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.streak}</div>
      <div class="stat-label">Day Streak</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.topicsDone}/${data.topicsTotal}</div>
      <div class="stat-label">Topics Done</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.avgFocus}/5</div>
      <div class="stat-label">Avg Focus</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.avgMood}/5</div>
      <div class="stat-label">Avg Mood</div>
    </div>
  </div>

  ${data.subjects.length > 0 ? `
  <h2>Subject Progress</h2>
  <table>
    <tr><th>Subject</th><th>Topics</th><th>Progress</th></tr>
    ${data.subjects.map((s) => `
    <tr>
      <td>${s.name}</td>
      <td>${s.done}/${s.total}</td>
      <td>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${s.total > 0 ? (s.done / s.total * 100) : 0}%"></div>
        </div>
      </td>
    </tr>`).join('')}
  </table>` : ''}

  ${data.recentSessions.length > 0 ? `
  <h2>Recent Sessions</h2>
  <table>
    <tr><th>Date</th><th>Stress Level</th><th>Duration</th></tr>
    ${data.recentSessions.map((s) => `
    <tr>
      <td>${new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
      <td>${(s.stressLevel || 'unknown').charAt(0).toUpperCase() + (s.stressLevel || 'unknown').slice(1)}</td>
      <td>${s.duration} min</td>
    </tr>`).join('')}
  </table>` : ''}

  <div class="footer">
    <p>Generated by <span class="highlight">Exam Stress Relief</span> — An HCI-based Study Companion</p>
  </div>
</body>
</html>`

    const blob = new Blob([reportHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    win.onload = () => {
      win.print()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Export Report</h2>
        <p className="text-sm text-muted-foreground mt-1">Download your study progress as PDF</p>
      </div>

      {/* Preview Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, label: 'Sessions', value: data.sessions, color: 'text-primary' },
          { icon: Clock, label: 'Hours', value: data.totalHours, color: 'text-primary' },
          { icon: Flame, label: 'Streak', value: data.streak, color: 'text-orange-500' },
          { icon: BookCheck, label: 'Topics', value: `${data.topicsDone}/${data.topicsTotal}`, color: 'text-green-500' },
          { icon: Star, label: 'Avg Focus', value: data.avgFocus, color: 'text-yellow-500' },
          { icon: null, label: 'Avg Mood', value: data.avgMood, color: 'text-pink-500', emoji: true },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-3 text-center">
              {stat.icon && <stat.icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />}
              {stat.emoji && <span className="text-sm">😊</span>}
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5 text-center space-y-3">
          <FileDown className="h-10 w-10 text-primary/30 mx-auto" />
          <p className="text-sm text-muted-foreground">
            Your report includes sessions, study time, subject progress, focus scores, and mood data.
          </p>
          <Button onClick={handleExport} size="lg" className="gap-2 w-full">
            <FileDown className="h-4 w-4" />
            Generate & Download PDF
          </Button>
          <p className="text-[10px] text-muted-foreground">
            Opens a print dialog — select "Save as PDF" to download
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
