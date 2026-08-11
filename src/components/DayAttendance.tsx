import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Info,
  CheckCheck,
  Ban,
  BookOpen,
  FlaskConical
} from 'lucide-react';
import { StudentProfile, TimetableVersion, TimetableEntry, AttendanceRecord } from '../types';
import { getTimetableEntriesForDate, formatDateReadable } from '../services/attendanceService';
import { SUBJECTS } from '../data/defaultData';

interface DayAttendanceProps {
  student: StudentProfile;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  versions: TimetableVersion[];
  allEntries: TimetableEntry[];
  records: Record<string, AttendanceRecord>;
  onMarkAttendance: (date: string, versionId: string, entryId: string, subjectCode: any, status: 'PRESENT' | 'ABSENT' | 'CLEAR') => void;
  onBulkMark: (date: string, versionId: string, entries: TimetableEntry[], status: 'PRESENT' | 'ABSENT') => void;
}

export const DayAttendance: React.FC<DayAttendanceProps> = ({
  student,
  selectedDate,
  setSelectedDate,
  versions,
  allEntries,
  records,
  onMarkAttendance,
  onBulkMark,
}) => {
  const { version, dayName, entries } = getTimetableEntriesForDate(selectedDate, student.batch, versions, allEntries);

  const shiftDate = (days: number) => {
    const d = new Date(`${selectedDate}T12:00:00`);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const setToday = () => {
    setSelectedDate('2026-08-11');
  };

  const eligibleEntries = entries.filter(e => e.isEligibleForB1 && e.subjectCode !== 'FREE' && e.type !== 'Free');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Date & Version Selection Header */}
      <div className="card-panel" style={{ background: '#ffffff', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>GTU ATTENDANCE MARKING</div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>Day-wise Attendance</h1>
            </div>

            {/* Quick Date Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={() => shiftDate(-1)} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '0.8125rem' }}>
                <ChevronLeft size={16} /> Prev
              </button>
              <button onClick={setToday} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '0.8125rem' }}>
                Today
              </button>
              <button onClick={() => shiftDate(1)} className="btn btn-outline" style={{ padding: '6px 10px', fontSize: '0.8125rem' }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Prominent Date Picker Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              border: '2px solid var(--primary-blue-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--primary-blue)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
              }}>
                <Calendar size={22} />
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-blue-hover)', textTransform: 'uppercase' }}>
                  Selected Date
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {formatDateReadable(selectedDate)} — <span style={{ color: 'var(--primary-blue)' }}>{dayName}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '280px' }}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #93c5fd',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>

          {/* Active Version Info Banner */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: version.id === 'v1_old' ? '#fff7ed' : '#f0fdf4',
              border: `1px solid ${version.id === 'v1_old' ? '#fed7aa' : '#bbf7d0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} color={version.id === 'v1_old' ? '#c2410c' : '#15803d'} />
              <div>
                <span className={`badge-pill ${version.id === 'v1_old' ? 'badge-amber' : 'badge-green'}`} style={{ marginRight: '6px' }}>
                  {version.name}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {version.description}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bulk Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            {dayName}'s Schedule ({entries.length} Sessions)
          </h2>
        </div>

        {eligibleEntries.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '360px' }}>
            <button
              onClick={() => onBulkMark(selectedDate, version.id, eligibleEntries, 'PRESENT')}
              className="btn btn-outline"
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.75rem', color: 'var(--success-green)', borderColor: '#bbf7d0', background: '#f0fdf4' }}
            >
              <CheckCheck size={15} /> All Present
            </button>
            <button
              onClick={() => onBulkMark(selectedDate, version.id, eligibleEntries, 'ABSENT')}
              className="btn btn-outline"
              style={{ flex: 1, padding: '8px 10px', fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: '#fecaca', background: '#fef2f2' }}
            >
              <Ban size={15} /> All Absent
            </button>
          </div>
        )}
      </div>

      {/* Timetable Entries List */}
      {dayName === 'Sunday' ? (
        <div className="card-panel" style={{ textAlign: 'center', padding: '36px 16px', background: '#ffffff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏖️</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Sunday Holiday</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '4px' }}>
            No lectures scheduled for Sunday under GTU timetable version <b>{version.name}</b>.
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="card-panel" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>No Timetable Entries Found</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {entries.map((entry) => {
            const isFree = entry.subjectCode === 'FREE' || entry.type === 'Free' || !entry.isEligibleForB1;
            const isLab = entry.type === 'Practical' || entry.type === 'Tutorial';
            const recKey = `${selectedDate}_${entry.id}`;
            const record = records[recKey];
            const currentStatus = record?.status;

            return (
              <div
                key={entry.id}
                className="card-panel"
                style={{
                  padding: '16px',
                  background: isFree ? '#f8fafc' : '#ffffff',
                  border: isFree ? '1px dashed #cbd5e1' : isLab ? '1px solid #ddd6fe' : '1px solid var(--border-color)',
                  borderLeft: isFree ? '4px solid #94a3b8' : isLab ? '5px solid #7c3aed' : '5px solid var(--primary-blue)',
                  opacity: isFree ? 0.85 : 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Time & Subject Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className={`badge-pill ${isFree ? 'badge-grey' : isLab ? 'badge-amber' : 'badge-blue'}`} style={{ background: isLab ? '#f3e8ff' : undefined, color: isLab ? '#7c3aed' : undefined, borderColor: isLab ? '#ddd6fe' : undefined }}>
                        {isLab ? <FlaskConical size={12} /> : <BookOpen size={12} />}
                        {isLab ? 'LAB (PRACTICAL)' : isFree ? 'FREE PERIOD' : 'LECTURE (THEORY)'}
                      </span>
                      {!isFree && <span className="badge-pill badge-grey">Batch {entry.batch}</span>}
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: isFree ? '#475569' : 'var(--text-main)', marginTop: '4px' }}>
                      {entry.subjectName}
                    </h3>
                  </div>

                  <div style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: isFree ? '#e2e8f0' : isLab ? '#f3e8ff' : 'var(--primary-blue-light)',
                    color: isFree ? '#475569' : isLab ? '#7c3aed' : 'var(--primary-blue-hover)',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}>
                    <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {entry.startTime} – {entry.endTime}
                  </div>
                </div>

                {/* Room & Faculty Details */}
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span><MapPin size={13} style={{ verticalAlign: 'middle' }} /> Room: <b>{entry.room}</b></span>
                  <span><User size={13} style={{ verticalAlign: 'middle' }} /> Faculty: <b>{entry.faculty}</b></span>
                  {entry.notes && <span style={{ color: 'var(--warning-amber)' }}>ℹ️ {entry.notes}</span>}
                </div>

                {/* Attendance Buttons - Full Width Touch Target for Mobile */}
                {!isFree && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => onMarkAttendance(selectedDate, version.id, entry.id, entry.subjectCode, 'PRESENT')}
                      className={`status-btn ${currentStatus === 'PRESENT' ? 'active-present' : ''}`}
                      style={{ flex: 1 }}
                    >
                      <CheckCircle size={17} style={{ marginRight: '6px' }} />
                      Present
                    </button>

                    <button
                      onClick={() => onMarkAttendance(selectedDate, version.id, entry.id, entry.subjectCode, 'ABSENT')}
                      className={`status-btn ${currentStatus === 'ABSENT' ? 'active-absent' : ''}`}
                      style={{ flex: 1 }}
                    >
                      <XCircle size={17} style={{ marginRight: '6px' }} />
                      Absent
                    </button>

                    {currentStatus && (
                      <button
                        onClick={() => onMarkAttendance(selectedDate, version.id, entry.id, entry.subjectCode, 'CLEAR')}
                        className="btn btn-ghost"
                        style={{ padding: '8px 10px', fontSize: '0.75rem' }}
                        title="Clear status"
                      >
                        <RotateCcw size={15} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
