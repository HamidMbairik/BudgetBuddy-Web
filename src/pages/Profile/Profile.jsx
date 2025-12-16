import React, { useState } from 'react'
import Sidebar from '../../components/common/sidebar'
import { useSidebar } from '../../contexts/SidebarContext'
import './Profile.css'
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi'
import { TbMoneybag, TbChartPie, TbTarget } from 'react-icons/tb'
import { usePreferences } from '../../contexts/PreferencesContext'

const Profile = () => {
  const { isCollapsed } = useSidebar()
  const { formatCurrency } = usePreferences()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2024-01-01',
    bio: 'Financial enthusiast focused on smart budgeting and long-term savings goals.',
  })

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

  const stats = [
    { icon: <TbMoneybag />, label: 'Total Income', value: formatCurrency(25400), color: '#22c55e' },
    { icon: <TbChartPie />, label: 'Total Expenses', value: formatCurrency(18200), color: '#f97316' },
    { icon: <TbTarget />, label: 'Savings Goal', value: formatCurrency(7200), color: '#3b82f6' },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // TODO: Save to backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // TODO: Reset to original values
  }

  return (
    <div className="profile-layout">
      <Sidebar links={links} currentPage="profile" title="BudgetBuddy" />
      <main
        className="profile-main"
        style={{ marginLeft: isCollapsed ? '80px' : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <div className="profile-container">
          {/* Header */}
          <header className="profile-header">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your personal information and preferences</p>
          </header>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <FiUser />
              </div>
              {!isEditing && (
                <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                  <FiEdit2 /> Edit Profile
                </button>
              )}
            </div>

            <div className="profile-info">
              <div className="profile-field">
                <label className="profile-label">
                  <FiUser className="field-icon" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-input"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{profileData.name}</p>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-label">
                  <FiMail className="field-icon" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    className="profile-input"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                ) : (
                  <p className="profile-value">{profileData.email}</p>
                )}
              </div>

              <div className="profile-field">
                <label className="profile-label">
                  <FiCalendar className="field-icon" />
                  Member Since
                </label>
                <p className="profile-value">
                  {new Date(profileData.joinDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="profile-field">
                <label className="profile-label">Bio</label>
                {isEditing ? (
                  <textarea
                    className="profile-textarea"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows="3"
                  />
                ) : (
                  <p className="profile-value">{profileData.bio}</p>
                )}
              </div>

              {isEditing && (
                <div className="profile-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <FiSave /> Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <FiX /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <section className="profile-stats">
            <h2 className="section-title">Your Statistics</h2>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon-wrapper" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Profile
