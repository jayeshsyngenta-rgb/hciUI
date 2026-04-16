import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ChevronDown, Plus, Trash2, Check, BookOpen } from 'lucide-react'

function getPlanner() {
  return JSON.parse(localStorage.getItem('studyPlanner') || '[]')
}

function savePlanner(data) {
  localStorage.setItem('studyPlanner', JSON.stringify(data))
}

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState(getPlanner)
  const [newSubject, setNewSubject] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [topicInputs, setTopicInputs] = useState({})

  useEffect(() => {
    savePlanner(subjects)
  }, [subjects])

  const addSubject = () => {
    const name = newSubject.trim()
    if (!name) return
    setSubjects((prev) => [
      ...prev,
      { id: Date.now(), subject: name, topics: [] },
    ])
    setNewSubject('')
  }

  const removeSubject = (id) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const addTopic = (subjectId) => {
    const name = (topicInputs[subjectId] || '').trim()
    if (!name) return
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, topics: [...s.topics, { id: Date.now(), name, done: false }] }
          : s
      )
    )
    setTopicInputs((prev) => ({ ...prev, [subjectId]: '' }))
  }

  const toggleTopic = (subjectId, topicId) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? {
              ...s,
              topics: s.topics.map((t) =>
                t.id === topicId ? { ...t, done: !t.done } : t
              ),
            }
          : s
      )
    )
  }

  const removeTopic = (subjectId, topicId) => {
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId
          ? { ...s, topics: s.topics.filter((t) => t.id !== topicId) }
          : s
      )
    )
  }

  const getProgress = (topics) => {
    if (topics.length === 0) return 0
    return Math.round((topics.filter((t) => t.done).length / topics.length) * 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold">Study Planner</h2>
        <p className="text-sm text-muted-foreground">
          Break down your syllabus into manageable chunks
        </p>
      </div>

      {/* Add Subject */}
      <div className="flex gap-2">
        <Input
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSubject()}
          placeholder="Add a subject (e.g., Mathematics)"
          className="flex-1"
        />
        <Button onClick={addSubject} className="gap-1 shrink-0">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              No subjects yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence>
          {subjects.map((subject) => {
            const progress = getProgress(subject.topics)
            const isExpanded = expandedId === subject.id

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                layout
              >
                <Card className="overflow-hidden">
                  {/* Subject Header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : subject.id)}
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                    <h3 className="font-semibold text-sm flex-1">{subject.subject}</h3>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="w-20 h-1.5" />
                      <span className="text-xs text-muted-foreground font-medium w-8 text-right">
                        {progress}%
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSubject(subject.id)
                        }}
                        className="text-muted-foreground/50 hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Topics */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CardContent className="px-4 py-3 space-y-1">
                          {subject.topics.map((topic) => (
                            <motion.div
                              key={topic.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2.5 py-2 group border-b border-border/50 last:border-0"
                            >
                              <button
                                onClick={() => toggleTopic(subject.id, topic.id)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all
                                  ${topic.done
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-border hover:border-primary'
                                  }`}
                              >
                                {topic.done && <Check className="h-3 w-3 text-white" />}
                              </button>
                              <span
                                className={`text-sm flex-1 transition-all ${
                                  topic.done ? 'line-through text-muted-foreground' : ''
                                }`}
                              >
                                {topic.name}
                              </span>
                              <button
                                onClick={() => removeTopic(subject.id, topic.id)}
                                className="text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-0.5"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </motion.div>
                          ))}

                          {/* Add Topic */}
                          <div className="flex gap-2 pt-2">
                            <Input
                              value={topicInputs[subject.id] || ''}
                              onChange={(e) =>
                                setTopicInputs((prev) => ({
                                  ...prev,
                                  [subject.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => e.key === 'Enter' && addTopic(subject.id)}
                              placeholder="Add a topic..."
                              className="flex-1 h-8 text-sm"
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => addTopic(subject.id)}
                              className="h-8 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
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
      )}
    </motion.div>
  )
}
