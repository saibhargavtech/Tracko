'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Learning {
  id: string
  title: string
  type: string
  source: string | null
  notes: string | null
  status: string
  rating: number | null
  completedAt: string | null
  createdAt: string
}

export default function LearningsTab() {
  const [learnings, setLearnings] = useState<Learning[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLearning, setEditingLearning] = useState<Learning | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  const [formData, setFormData] = useState({
    title: '',
    type: 'article',
    source: '',
    notes: '',
    status: 'in-progress',
    rating: 0,
  })

  useEffect(() => {
    fetchLearnings()
  }, [])

  const fetchLearnings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('learnings')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      setLearnings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setError(null)
      const learningData = {
        id: editingLearning?.id || crypto.randomUUID(),
        title: formData.title,
        type: formData.type,
        source: formData.source || null,
        notes: formData.notes || null,
        status: formData.status,
        rating: formData.rating > 0 ? formData.rating : null,
        completedAt: formData.status === 'completed' ? new Date().toISOString() : null,
      }

      if (editingLearning) {
        const { error } = await supabase
          .from('learnings')
          .update(learningData)
          .eq('id', editingLearning.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('learnings')
          .insert([learningData])
        if (error) throw error
      }

      setShowModal(false)
      resetForm()
      fetchLearnings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this learning?')) return

    try {
      const { error } = await supabase
        .from('learnings')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchLearnings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleComplete = async (learning: Learning) => {
    try {
      const { error } = await supabase
        .from('learnings')
        .update({
          status: 'completed',
          completedAt: new Date().toISOString(),
        })
        .eq('id', learning.id)
      if (error) throw error
      fetchLearnings()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleEdit = (learning: Learning) => {
    setEditingLearning(learning)
    setFormData({
      title: learning.title,
      type: learning.type,
      source: learning.source || '',
      notes: learning.notes || '',
      status: learning.status,
      rating: learning.rating || 0,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'article',
      source: '',
      notes: '',
      status: 'in-progress',
      rating: 0,
    })
    setEditingLearning(null)
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  const filteredLearnings = learnings.filter((learning) => {
    if (filter === 'all') return true
    if (filter === 'in-progress') return learning.status === 'in-progress'
    if (filter === 'completed') return learning.status === 'completed'
    return true
  })

  if (loading) {
    return <div className="loading">Loading learnings...</div>
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Learnings</h2>
        <button className="add-button" onClick={openNewModal}>
          + Add Learning
        </button>
      </div>

      <div className="tabs" style={{ marginBottom: '1rem' }}>
        <button
          className={`tab-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`tab-button ${filter === 'in-progress' ? 'active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </button>
        <button
          className={`tab-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {filteredLearnings.length === 0 ? (
        <div className="empty-state">
          <p>No learnings yet. Add your first learning!</p>
        </div>
      ) : (
        filteredLearnings.map((learning) => (
          <div key={learning.id} className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{learning.title}</div>
                <div className="card-meta">
                  <span className={`badge badge-${learning.status === 'completed' ? 'completed' : 'in-progress'}`}>
                    {learning.status}
                  </span>
                  <span>📚 {learning.type}</span>
                  {learning.source && <span>🔗 {learning.source}</span>}
                  {learning.rating && <span>⭐ {learning.rating}/5</span>}
                  {learning.completedAt && (
                    <span>✅ {format(new Date(learning.completedAt), 'MMM dd, yyyy')}</span>
                  )}
                </div>
              </div>
            </div>
            {learning.notes && (
              <div className="card-description">{learning.notes}</div>
            )}
            <div className="card-actions">
              {learning.status !== 'completed' && (
                <button className="btn btn-complete" onClick={() => handleComplete(learning)}>
                  Complete
                </button>
              )}
              <button className="btn btn-edit" onClick={() => handleEdit(learning)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(learning.id)}>
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
              <h3>{editingLearning ? 'Edit Learning' : 'New Learning'}</h3>
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
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="article">Article</option>
                  <option value="book">Book</option>
                  <option value="video">Video</option>
                  <option value="course">Course</option>
                  <option value="podcast">Podcast</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Source</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="URL or name"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingLearning ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

