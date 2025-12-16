import React, { useState } from 'react'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import './Notes.css'
import { TbFileText, TbPlus, TbSearch, TbEdit, TbTrash, TbCalendar } from 'react-icons/tb'

const Notes = () => {
  const { isCollapsed } = useSidebar()
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Monthly Budget Planning',
      content: 'Review expenses from last month and adjust budget for groceries and entertainment.',
      date: '2024-01-15',
      category: 'Budget',
    },
    {
      id: 2,
      title: 'Savings Goal - Vacation',
      content: 'Save $2,000 by June for summer vacation. Currently at $1,200.',
      date: '2024-01-10',
      category: 'Goals',
    },
    {
      id: 3,
      title: 'Investment Research',
      content: 'Research index funds and ETFs for long-term investment strategy.',
      date: '2024-01-08',
      category: 'Investment',
    },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'General' })

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

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      const note = {
        id: notes.length + 1,
        ...newNote,
        date: new Date().toISOString().split('T')[0],
      }
      setNotes([note, ...notes])
      setNewNote({ title: '', content: '', category: 'General' })
      setShowAddForm(false)
    }
  }

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id))
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
            <button className="add-note-btn" onClick={() => setShowAddForm(!showAddForm)}>
              <TbPlus /> {showAddForm ? 'Cancel' : 'New Note'}
            </button>
          </header>

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
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button className="save-note-btn" onClick={handleAddNote}>
                  Save Note
                </button>
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
                      <button className="note-action-btn" title="Edit">
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
