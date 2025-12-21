import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import { useAuth } from '../../contexts/AuthContext'
import { getNotes, addNote, updateNote, deleteNote, searchNotes } from '../../services/notesService'
import './Notes.css'
import { TbFileText, TbPlus, TbSearch, TbEdit, TbTrash, TbCalendar, TbX } from 'react-icons/tb'

const Notes = () => {
  const { isCollapsed } = useSidebar()
  const { currentUser } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'General' })

  // Load notes data from Firebase
  useEffect(() => {
    const loadNotesData = async () => {
      if (!currentUser?.uid) return

      setLoading(true)
      setError(null)
      try {
        const result = await getNotes(currentUser.uid)
        if (result.error) {
          setError(result.error)
        } else {
          // Convert Firestore dates to string format for display
          const formattedNotes = result.data.map((item) => ({
            ...item,
            date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          }))
          setNotes(formattedNotes)
        }
      } catch (err) {
        setError('Failed to load notes')
        console.error('Load notes error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadNotesData()
  }, [currentUser])

  // Search notes when searchQuery changes
  useEffect(() => {
    const performSearch = async () => {
      if (!currentUser?.uid) return

      if (searchQuery.trim()) {
        setLoading(true)
        try {
          const result = await searchNotes(currentUser.uid, searchQuery)
          if (!result.error) {
            const formattedNotes = result.data.map((item) => ({
              ...item,
              date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setNotes(formattedNotes)
          }
        } catch (err) {
          console.error('Search error:', err)
        } finally {
          setLoading(false)
        }
      } else {
        // Reload all notes if search is cleared
        const loadNotesData = async () => {
          setLoading(true)
          try {
            const result = await getNotes(currentUser.uid)
            if (!result.error) {
              const formattedNotes = result.data.map((item) => ({
                ...item,
                date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              }))
              setNotes(formattedNotes)
            }
          } catch (err) {
            console.error('Load notes error:', err)
          } finally {
            setLoading(false)
          }
        }
        loadNotesData()
      }
    }

    const timeoutId = setTimeout(performSearch, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchQuery, currentUser])

  const links = [
    { name: 'Home', path: '/home' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Agent', path: '/agent' },
    { name: 'Notes', path: '/notes' },
    { name: 'Income', path: '/income' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
  ]

  const categories = ['General', 'Budget', 'Goals', 'Investment', 'Expenses', 'Income']

  // Filter notes (client-side filtering for display, search is handled by Firebase)
  const filteredNotes = notes

  const handleAddNote = async () => {
    if (!currentUser?.uid) {
      setError('You must be logged in to add notes')
      return
    }

    if (!newNote.title.trim()) {
      setError('Note title is required')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (editingId) {
        // Update existing note
        const result = await updateNote(currentUser.uid, editingId, {
          title: newNote.title,
          content: newNote.content,
          category: newNote.category,
        })

        if (result.error) {
          setError(result.error)
        } else {
          // Reload notes
          const notesResult = await getNotes(currentUser.uid)
          if (!notesResult.error) {
            const formattedNotes = notesResult.data.map((item) => ({
              ...item,
              date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setNotes(formattedNotes)
          }
          setEditingId(null)
          setShowAddForm(false)
          setNewNote({ title: '', content: '', category: 'General' })
        }
      } else {
        // Add new note
        const result = await addNote(currentUser.uid, {
          title: newNote.title,
          content: newNote.content,
          category: newNote.category,
        })

        if (result.error) {
          setError(result.error)
        } else {
          // Reload notes
          const notesResult = await getNotes(currentUser.uid)
          if (!notesResult.error) {
            const formattedNotes = notesResult.data.map((item) => ({
              ...item,
              date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setNotes(formattedNotes)
          }
          setShowAddForm(false)
          setNewNote({ title: '', content: '', category: 'General' })
        }
      }
    } catch (err) {
      setError('Failed to save note')
      console.error('Add note error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteNote = async (id) => {
    if (!currentUser?.uid) return

    if (window.confirm('Are you sure you want to delete this note?')) {
      setLoading(true)
      try {
        const result = await deleteNote(currentUser.uid, id)
        if (result.error) {
          setError(result.error)
        } else {
          // Reload notes
          const notesResult = await getNotes(currentUser.uid)
          if (!notesResult.error) {
            const formattedNotes = notesResult.data.map((item) => ({
              ...item,
              date: item.createdAt ? item.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            }))
            setNotes(formattedNotes)
          }
        }
      } catch (err) {
        setError('Failed to delete note')
        console.error('Delete note error:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEdit = (note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
    })
    setEditingId(note.id)
    setShowAddForm(true)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingId(null)
    setNewNote({ title: '', content: '', category: 'General' })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="notes-layout">
      <Sidebar links={links} currentPage="notes" title="BudgetBuddy" />
      <main
        className="notes-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="notes-container">
          {/* Header */}
          <header className="notes-header">
            <div>
              <h1 className="notes-title">My Notes</h1>
              <p className="notes-subtitle">Keep track of your financial thoughts and plans</p>
            </div>
            <button className="add-note-btn" onClick={() => {
              if (showAddForm) {
                handleCancel()
              } else {
                setShowAddForm(true)
              }
            }}>
              <TbPlus /> {showAddForm ? 'Cancel' : 'New Note'}
            </button>
          </header>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              color: '#9ca3af',
            }}>
              {searchQuery ? 'Searching notes...' : 'Loading notes...'}
            </div>
          )}

          {/* Search Bar */}
          <div className="notes-search">
            <TbSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Add Note Form */}
          {showAddForm && (
            <div className="add-note-form">
              <input
                type="text"
                className="form-input"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <textarea
                className="form-textarea"
                placeholder="Note content..."
                rows="4"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
              <div className="form-actions">
                <select
                  className="form-select"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                  disabled={submitting}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    className="cancel-btn" 
                    onClick={handleCancel}
                    disabled={submitting}
                    style={{ padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #374151', color: '#fff', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <TbX /> Cancel
                  </button>
                  <button 
                    className="save-note-btn" 
                    onClick={handleAddNote}
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Note' : 'Save Note'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          <div className="notes-grid">
            {filteredNotes.length === 0 ? (
              <div className="empty-state">
                <TbFileText className="empty-icon" />
                <p className="empty-text">No notes found</p>
                <p className="empty-subtext">
                  {searchQuery ? 'Try a different search term' : 'Create your first note to get started'}
                </p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className="note-card">
                  <div className="note-header">
                    <span className="note-category">{note.category}</span>
                    <div className="note-actions">
                      <button className="note-action-btn" onClick={() => handleEdit(note)} title="Edit">
                        <TbEdit />
                      </button>
                      <button
                        className="note-action-btn delete"
                        onClick={() => handleDeleteNote(note.id)}
                        title="Delete"
                      >
                        <TbTrash />
                      </button>
                    </div>
                  </div>
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                  <div className="note-footer">
                    <div className="note-date">
                      <TbCalendar />
                      <span>{formatDate(note.date)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Notes
