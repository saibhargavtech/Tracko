'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Todo {
  id: string
  title: string
  description: string | null
  category: string
  priority: string
  status: string
  dueDate: string | null
  completedAt: string | null
  createdAt: string
}

export default function TodosTab() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
  })

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('createdAt', { ascending: false })

      if (error) throw error
      setTodos(data || [])
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
      const todoData = {
        id: editingTodo?.id || crypto.randomUUID(),
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null,
        completedAt: formData.status === 'completed' ? new Date().toISOString() : null,
      }

      if (editingTodo) {
        const { error } = await supabase
          .from('todos')
          .update(todoData)
          .eq('id', editingTodo.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('todos')
          .insert([todoData])
        if (error) throw error
      }

      setShowModal(false)
      resetForm()
      fetchTodos()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) return

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchTodos()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleComplete = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({
          status: 'completed',
          completedAt: new Date().toISOString(),
        })
        .eq('id', todo.id)
      if (error) throw error
      fetchTodos()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setFormData({
      title: todo.title,
      description: todo.description || '',
      category: todo.category,
      priority: todo.priority,
      status: todo.status,
      dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
    })
    setEditingTodo(null)
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true
    if (filter === 'pending') return todo.status === 'pending'
    if (filter === 'completed') return todo.status === 'completed'
    return true
  })

  if (loading) {
    return <div className="loading">Loading todos...</div>
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2>Todos</h2>
        <button className="add-button" onClick={openNewModal}>
          + Add Todo
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
          className={`tab-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`tab-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet. Add your first todo!</p>
        </div>
      ) : (
        filteredTodos.map((todo) => (
          <div key={todo.id} className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{todo.title}</div>
                <div className="card-meta">
                  <span className={`badge badge-${todo.status === 'completed' ? 'completed' : todo.status === 'pending' ? 'pending' : 'in-progress'}`}>
                    {todo.status}
                  </span>
                  <span className={`badge badge-${todo.priority}`}>
                    {todo.priority} priority
                  </span>
                  <span>📁 {todo.category}</span>
                  {todo.dueDate && (
                    <span>📅 Due: {format(new Date(todo.dueDate), 'MMM dd, yyyy')}</span>
                  )}
                </div>
              </div>
            </div>
            {todo.description && (
              <div className="card-description">{todo.description}</div>
            )}
            <div className="card-actions">
              {todo.status !== 'completed' && (
                <button className="btn btn-complete" onClick={() => handleComplete(todo)}>
                  Complete
                </button>
              )}
              <button className="btn btn-edit" onClick={() => handleEdit(todo)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(todo.id)}>
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
              <h3>{editingTodo ? 'Edit Todo' : 'New Todo'}</h3>
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
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingTodo ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

