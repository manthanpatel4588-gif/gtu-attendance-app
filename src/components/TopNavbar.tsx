import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BookOpen, 
  History, 
  Clock, 
  Settings, 
  ShieldCheck, 
  GraduationCap 
} from 'lucide-react';
import { StudentProfile } from '../types';

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile;
  onOpenTestModal: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenTestModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Day-wise Attendance', icon: CalendarCheck },
    { id: 'subjects', label: 'Subjects & 75% Target', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'timetables', label: 'Timetables', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="top-navbar">
      <div className="top-navbar-container">
        {/* Brand Logo & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
            flexShrink: 0,
          }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>GTU Track</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              CE V-B • Batch {student.batch}
            </p>
          </div>
        </div>

        {/* Horizontal Navigation Links */}
        <nav className="desktop-nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`top-nav-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenTestModal}
            className="btn btn-outline"
            style={{
              padding: '7px 12px',
              fontSize: '0.75rem',
              color: '#166534',
              borderColor: '#bbf7d0',
              background: '#f0fdf4',
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={16} />
            <span className="hide-on-mobile">Run Tests</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Bar */}
      <nav className="mobile-sub-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
