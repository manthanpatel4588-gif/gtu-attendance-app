import React from 'react';
import { LayoutDashboard, CalendarCheck, BookOpen, History, Clock, GraduationCap, ShieldCheck } from 'lucide-react';
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
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
        className="mobile-header"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'var(--primary-blue)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 800 }}>GTU Track</h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CE V-B ({student.batch})</p>
          </div>
        </div>

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
      </header>

      {/* Bottom Bar Mobile */}
      <nav
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#ffffff',
          borderTop: '1px solid var(--border-color)',
          padding: '6px 4px 10px',
          zIndex: 50,
          justifyContent: 'space-around',
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
                background: 'transparent',
                border: 'none',
                color: isActive ? 'var(--primary-blue)' : '#64748b',
                fontSize: '0.6875rem',
                fontWeight: isActive ? 700 : 500,
                padding: '4px 8px',
              }}
            >
              <Icon size={18} />
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
