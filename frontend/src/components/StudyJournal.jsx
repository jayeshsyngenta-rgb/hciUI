import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PenLine, Calendar, Trash2, ChevronDown } from 'lucide-react'

const PROMPTS = [
  "What did you study today and how did it go?",
  "What is one thing that stressed you today?",
  "Name 3 things you are grateful for right now.",
  "What topic do you need to focus on tomorrow?",
  "How are you feeling about your exam preparation?",
  "What study technique worked well for you today?",
  "What would you do differently next time?",
  "Write one positive thing about yourself.",
]

function getEntries() {
  return JSON.parse(localStorage.getItem('journalEntries') || '[]')
}

function saveEntries(entries) {
  localStorage.setItem('journalEntries', JSON.stringify(entries))
}

export default function StudyJournal() {
  const [entries, setEntries] = useState(getEntries)
  const [isWriting, setIsWriting] = useState(false)
  const [text, setText] = useState('')
  const [prompt, setPrompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [expandedId, setExpandedId] = useState(null)

  const sortedEntries = useMemo(() => [...entries].reverse(), [entries])

  const handleSave = () => {
    if (!text.trim()) return
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      prompt,
      text: text.trim(),
    }
    const updated = [...entries, newEntry]
    setEntries(updated)
    saveEntries(updated)
    setText('')
    setIsWriting(false)
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }

  const handleDelete = (id) => {
    const updated = entries.filter((e) => e.id !== id)
    setEntries(updated)
    saveEntries(updated)
  }

  const newPrompt = () => {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Study Journal</h2>
        <p className="text-sm text-muted-foreground mt-1">Reflect on your study journey</p>
      </div>

      {/* Write New Entry */}
      {!isWriting ? (
        <Button onClick={() => setIsWriting(true)} className="gap-2">
          <PenLine className="h-4 w-4" />
          Write Today's Entry
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Card>
            <CardContent className="p-4 space-y-3">
              {/* Prompt */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-primary italic">"{prompt}"</p>
                <button
                  onClick={newPrompt}
                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors shrink-0 underline"
                >
                  New prompt
                </button>
              </div>

              {/* Text Area */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start writing your thoughts..."
                rows={4}
                className="w-full p-3 rounded-lg border border-border bg-secondary/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                autoFocus
              />

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => { setIsWriting(false); setText('') }}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={!text.trim()}>
                  Save Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Entries Timeline */}
      {sortedEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <PenLine className="h-12 w-12 text-muted-foreground/20" />
            <p className="text-muted-foreground text-sm">No journal entries yet.</p>
            <p className="text-muted-foreground text-xs">Writing helps you process stress and reflect on progress.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {sortedEntries.map((entry) => {
              const isExpanded = expandedId === entry.id
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                >
                  <Card>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-secondary/30 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{entry.text}</p>
                      </div>
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <CardContent className="px-4 pb-4 pt-0 space-y-2">
                            <p className="text-xs text-primary italic">"{entry.prompt}"</p>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                            <div className="flex justify-end">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(entry.id) }}
                                className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
