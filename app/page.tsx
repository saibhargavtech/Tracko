'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import MeetingsTab from '@/components/MeetingsTab'
import TodosTab from '@/components/TodosTab'
import LearningsTab from '@/components/LearningsTab'

type Tab = 'meetings' | 'todos' | 'learnings'

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('meetings')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="container">
      <div className="header">
        <h1>📋 Meeting Tracker</h1>
        <p>Track your meetings, todos, and learnings in one place</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'meetings' ? 'active' : ''}`}
          onClick={() => setActiveTab('meetings')}
        >
          📅 Meetings
        </button>
        <button
          className={`tab-button ${activeTab === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveTab('todos')}
        >
          ✅ Todos
        </button>
        <button
          className={`tab-button ${activeTab === 'learnings' ? 'active' : ''}`}
          onClick={() => setActiveTab('learnings')}
        >
          📚 Learnings
        </button>
      </div>

      {activeTab === 'meetings' && <MeetingsTab />}
      {activeTab === 'todos' && <TodosTab />}
      {activeTab === 'learnings' && <LearningsTab />}
    </div>
  )
}

