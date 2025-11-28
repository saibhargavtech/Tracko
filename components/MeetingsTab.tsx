'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Meeting {
  id: string
  title: string
  description: string | null
  date: string
  duration: number
  attendees: string | null
  notes: string | null
  createdAt: string
}

export default function MeetingsTab() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: 30,
    attendees: '',
    notes: '',
  })

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setMeetings(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      const meetingData = {
        id: editingMeeting?.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description || null,
        date: formData.date,
        duration: formData.duration,
        attendees: formData.attendees || null,
        notes: formData.notes || null,
      }

      if (editingMeeting) {
        const { error } = await supabase
          .from('meetings')
          .update(meetingData)
          .eq('id', editingMeeting.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('meetings')
          .insert([meetingData])
        if (error) throw error
      }

      setShowModal(false)
      resetForm()
      fetchMeetings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return

    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchMeetings()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting)
    setFormData({
      title: meeting.title,
      description: meeting.description || '',
      date: new Date(meeting.date).toISOString().slice(0, 16),
      duration: meeting.duration,
      attendees: meeting.attendees || '',
      notes: meeting.notes || '',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      duration: 30,
      attendees: '',
      notes: '',
    })
    setEditingMeeting(null)
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  if (loading) {
    return <div className="loading">Loading meetings...</div>
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Meetings</h2>
        <button className="add-button" onClick={openNewModal}>
          + Add Meeting
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {meetings.length === 0 ? (
        <div className="empty-state">
          <p>No meetings yet. Add your first meeting!</p>
        </div>
      ) : (
        meetings.map((meeting) => (
          <div key={meeting.id} className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{meeting.title}</div>
                <div className="card-meta">
                  <span>📅 {format(new Date(meeting.date), 'MMM dd, yyyy HH:mm')}</span>
                  <span>⏱️ {meeting.duration} min</span>
                  {meeting.attendees && <span>👥 {meeting.attendees}</span>}
                </div>
              </div>
            </div>
            {meeting.description && (
              <div className="card-description">{meeting.description}</div>
            )}
            {meeting.notes && (
              <div className="card-description">
                <strong>Notes:</strong> {meeting.notes}
              </div>
            )}
            <div className="card-actions">
              <button className="btn btn-edit" onClick={() => handleEdit(meeting)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(meeting.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMeeting ? 'Edit Meeting' : 'New Meeting'}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Attendees</label>
                <input
                  type="text"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  placeholder="e.g., John, Jane, Bob"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingMeeting ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

