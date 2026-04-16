import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import Header from './components/Header'
import Home from './components/Home'
import StressSelector from './components/StressSelector'
import Suggestion from './components/Suggestion'
import StudyTimer from './components/StudyTimer'
import Completion from './components/Completion'
import StudyPlanner from './components/StudyPlanner'
import ProgressDashboard from './components/ProgressDashboard'
import ProgressBar from './components/ProgressBar'
import BreathingExercise from './components/BreathingExercise'
import Badges from './components/Badges'
import AIChat from './components/AIChat'
import VirtualGarden from './components/VirtualGarden'
import MoodTracker, { MoodCheck } from './components/MoodTracker'
import FocusRating from './components/FocusRating'
import StudyJournal from './components/StudyJournal'
import ExportReport from './components/ExportReport'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [sessionStep, setSessionStep] = useState(1)
  const [stressLevel, setStressLevel] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showMoodBefore, setShowMoodBefore] = useState(false)
  const [showMoodAfter, setShowMoodAfter] = useState(false)
  const [showFocusRating, setShowFocusRating] = useState(false)

  const saveMood = useCallback((value, type) => {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]')
    history.push({ date: new Date().toISOString(), value, type })
    localStorage.setItem('moodHistory', JSON.stringify(history))
  }, [])

  const handleStressSelect = useCallback(async (level) => {
    setIsLoading(true)
    setStressLevel(level)
    try {
      const res = await fetch(`/api/recommendation/${level}`)
      const data = await res.json()
      setRecommendation(data)
      setSessionStep(2)
    } catch (err) {
      console.error('Failed to fetch recommendation:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleStartTimer = useCallback(() => {
    // Show mood check before starting
    setShowMoodBefore(true)
  }, [])

  const handleMoodBeforeDone = useCallback((value) => {
    saveMood(value, 'before')
    setShowMoodBefore(false)
    setSessionStep(3)
  }, [saveMood])

  const handleTimerComplete = useCallback(() => {
    // Save session to localStorage
    const sessions = JSON.parse(localStorage.getItem('studySessions') || '[]')
    sessions.push({
      date: new Date().toISOString(),
      stressLevel: stressLevel,
      duration: recommendation?.timer_config?.study_minutes || 0,
      completed: true,
    })
    localStorage.setItem('studySessions', JSON.stringify(sessions))

    // Update streak
    const today = new Date().toISOString().split('T')[0]
    const streakData = JSON.parse(localStorage.getItem('streakData') || '{"currentStreak":0,"lastStudyDate":""}')
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    if (streakData.lastStudyDate === today) {
      // Already studied today
    } else if (streakData.lastStudyDate === yesterday) {
      streakData.currentStreak += 1
    } else {
      streakData.currentStreak = 1
    }
    streakData.lastStudyDate = today
    localStorage.setItem('streakData', JSON.stringify(streakData))

    // Show focus rating first
    setShowFocusRating(true)
  }, [stressLevel, recommendation])

  const handleFocusRated = useCallback(() => {
    setShowFocusRating(false)
    setShowMoodAfter(true)
  }, [])

  const handleMoodAfterDone = useCallback((value) => {
    saveMood(value, 'after')
    setShowMoodAfter(false)
    setSessionStep(4)
  }, [saveMood])

  const handleRestart = useCallback(() => {
    setSessionStep(1)
    setStressLevel(null)
    setRecommendation(null)
    setShowMoodBefore(false)
    setShowMoodAfter(false)
    setShowFocusRating(false)
  }, [])

  const handleGoHome = useCallback(() => {
    setCurrentView('home')
    handleRestart()
  }, [handleRestart])

  const handleNavigate = useCallback((view) => {
    setCurrentView(view)
    if (view === 'session') {
      handleRestart()
    }
  }, [handleRestart])

  const renderContent = () => {
    if (currentView === 'home') return <Home key="home" onNavigate={handleNavigate} />
    if (currentView === 'planner') return <StudyPlanner key="planner" />
    if (currentView === 'progress') return <ProgressDashboard key="progress" />
    if (currentView === 'breathing') return <BreathingExercise key="breathing" />
    if (currentView === 'badges') return <Badges key="badges" />
    if (currentView === 'chat') return <AIChat key="chat" />
    if (currentView === 'garden') return <VirtualGarden key="garden" />
    if (currentView === 'mood') return <MoodTracker key="mood" />
    if (currentView === 'journal') return <StudyJournal key="journal" />
    if (currentView === 'export') return <ExportReport key="export" />

    if (currentView === 'session') {
      return (
        <div key="session">
          <ProgressBar currentStep={sessionStep} />
          <AnimatePresence mode="wait">
            {sessionStep === 1 && (
              <StressSelector
                key="stress"
                onSelect={handleStressSelect}
                isLoading={isLoading}
              />
            )}
            {sessionStep === 2 && !showMoodBefore && (
              <Suggestion
                key="suggestion"
                data={recommendation}
                onStartTimer={handleStartTimer}
              />
            )}
            {sessionStep === 2 && showMoodBefore && (
              <div key="mood-before" className="flex flex-col items-center gap-6 pt-8">
                <MoodCheck
                  label="How are you feeling before studying?"
                  onSelect={handleMoodBeforeDone}
                />
              </div>
            )}
            {sessionStep === 3 && !showFocusRating && !showMoodAfter && (
              <StudyTimer
                key="timer"
                minutes={recommendation?.timer_config?.study_minutes || 25}
                breakMinutes={recommendation?.timer_config?.break_minutes || 5}
                stressLevel={stressLevel}
                onComplete={handleTimerComplete}
              />
            )}
            {showFocusRating && (
              <div key="focus-rating" className="flex flex-col items-center gap-6 pt-8">
                <FocusRating onRate={handleFocusRated} />
              </div>
            )}
            {showMoodAfter && (
              <div key="mood-after" className="flex flex-col items-center gap-6 pt-8">
                <MoodCheck
                  label="How are you feeling after studying?"
                  onSelect={handleMoodAfterDone}
                />
              </div>
            )}
            {sessionStep === 4 && (
              <Completion
                key="completion"
                recommendation={recommendation}
                onRestart={handleRestart}
                onGoHome={handleGoHome}
              />
            )}
          </AnimatePresence>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onBack={currentView !== 'home' ? handleGoHome : null}
      />
      <main className="max-w-2xl mx-auto px-4 py-6 w-full">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
