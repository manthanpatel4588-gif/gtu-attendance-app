import React from 'react';
import { LayoutDashboard, CalendarCheck, BookOpen, History, Clock, GraduationCap, ShieldCheck, Settings } from 'lucide-react';
import { StudentProfile } from '../types';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile;
  onOpenTestModal: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenTestModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'history', label: 'History', icon: History },
    { id: 'timetables', label: 'Timetables', icon: Clock },
  ];

  return (
    <>
      {/* Top Header Mobile */}
      <header
        style={{
          display: 'none',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
        className="mobile-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.2 }}>GTU Track</h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>CE V-B • Batch {student.batch}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenTestModal}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldCheck size={14} />
            <span>Tests</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: activeTab === 'settings' ? 'var(--primary-blue-light)' : '#f8fafc',
              border: '1px solid var(--border-color)',
              color: activeTab === 'settings' ? 'var(--primary-blue)' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Floating Bottom Nav Glassmorphism Bar Mobile */}
      <nav
        style={{
          display: 'none',
          position: 'fixed',
          bottom: '12px',
          left: '12px',
          right: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '20px',
          padding: '6px 8px',
          zIndex: 50,
          justifyContent: 'space-around',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
        }}
        className="mobile-bottom-nav"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: isActive ? 'var(--primary-blue-light)' : 'transparent',
                border: 'none',
                color: isActive ? 'var(--primary-blue)' : '#64748b',
                fontSize: '0.6875rem',
                fontWeight: isActive ? 800 : 600,
                padding: '6px 12px',
                borderRadius: '14px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                flex: 1,
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-header {
            display: flex !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
