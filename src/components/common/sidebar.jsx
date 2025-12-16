import React from 'react'
import { Link } from 'react-router-dom'
import { FiSettings, FiUser, FiHome, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { TbChartPie, TbFileText, TbMoneybag, TbPlus, TbRobot } from 'react-icons/tb'
import { useSidebar } from '../../contexts/SidebarContext'
import { usePreferences } from '../../contexts/PreferencesContext'
import './sidebar.css'

const Sidebar = ({ links, currentPage, title }) => {
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { t } = usePreferences()

  const mainLinks = links.filter(
    (link) => !['settings', 'profile'].includes(link.name.toLowerCase())
  )
  const bottomLinks = links.filter((link) =>
    ['settings', 'profile'].includes(link.name.toLowerCase())
  )

  const renderLink = (link) => {
    const lowerName = link.name.toLowerCase()

    let icon = null
    if (lowerName === 'home') icon = <FiHome className="sidebar-link-icon" />
    if (lowerName === 'dashboard') icon = <TbChartPie className="sidebar-link-icon" />
    if (lowerName === 'agent') icon = <TbRobot className="sidebar-link-icon" />
    if (lowerName === 'notes') icon = <TbFileText className="sidebar-link-icon" />
    if (lowerName === 'income') icon = <TbPlus className="sidebar-link-icon" />
    if (lowerName === 'expenses') icon = <TbMoneybag className="sidebar-link-icon" />
    if (lowerName === 'settings') icon = <FiSettings className="sidebar-link-icon" />
    if (lowerName === 'profile') icon = <FiUser className="sidebar-link-icon" />

    return (
      <Link
        key={link.path}
        to={link.path}
        className={`sidebar-link ${currentPage === lowerName ? 'active' : ''}`}
        title={isCollapsed ? t(lowerName) : ''}
      >
        {icon}
        {!isCollapsed && <h2 className="sidebar-link-text">{t(lowerName)}</h2>}
      </Link>
    )
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <Link to="/home" className="sidebar-logo">
            <h1 className="sidebar-title">{title}</h1>
          </Link>
        )}
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-links">
        {mainLinks.map(renderLink)}
      </nav>

      <div className="sidebar-footer">
        {bottomLinks.map(renderLink)}
      </div>
    </aside>
  )
}

export default Sidebar