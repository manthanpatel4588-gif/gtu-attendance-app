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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Date & Version Selection Header */}
      <div className="card-panel" style={{ background: '#ffffff', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>GTU ATTENDANCE MARKING</div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>Day-wise Attendance</h1>
            </div>

            {/* Quick Date Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => shiftDate(-1)} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                <ChevronLeft size={16} /> Prev
              </button>
              <button onClick={setToday} className="btn btn-outline" style={{ padding: '8px 12px' }}>
                Today
              </button>
              <button onClick={() => shiftDate(1)} className="btn btn-outline" style={{ padding: '8px 12px' }}>
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
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--primary-blue)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)'
              }}>
                <Calendar size={24} />
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue-hover)', textTransform: 'uppercase' }}>
                  Selected Date (Source of Truth)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {formatDateReadable(selectedDate)} — <span style={{ color: 'var(--primary-blue)' }}>{dayName}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)' }}>Change Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #93c5fd',
                  background: '#ffffff',
                  fontSize: '0.95rem',
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
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: version.id === 'v1_old' ? '#fff7ed' : '#f0fdf4',
              border: `1px solid ${version.id === 'v1_old' ? '#fed7aa' : '#bbf7d0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} color={version.id === 'v1_old' ? '#c2410c' : '#15803d'} />
              <div>
                <span className={`badge-pill ${version.id === 'v1_old' ? 'badge-amber' : 'badge-green'}`} style={{ marginRight: '8px' }}>
                  {version.name}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {version.description}
                </span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Effective Range: {version.effective_from} to {version.effective_to || 'Present (Ongoing)'}
            </div>
          </div>

        </div>
      </div>

      {/* Bulk Action Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {dayName}'s Schedule ({entries.length} Sessions)
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Lectures & Labs are categorized and counted separately.
          </p>
        </div>

        {eligibleEntries.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onBulkMark(selectedDate, version.id, eligibleEntries, 'PRESENT')}
              className="btn btn-outline"
              style={{ padding: '7px 12px', fontSize: '0.8125rem', color: 'var(--success-green)', borderColor: '#bbf7d0', background: '#f0fdf4' }}
            >
              <CheckCheck size={16} /> Mark All Present
            </button>
            <button
              onClick={() => onBulkMark(selectedDate, version.id, eligibleEntries, 'ABSENT')}
              className="btn btn-outline"
              style={{ padding: '7px 12px', fontSize: '0.8125rem', color: 'var(--danger-red)', borderColor: '#fecaca', background: '#fef2f2' }}
            >
              <Ban size={16} /> Mark All Absent
            </button>
          </div>
        )}
      </div>

      {/* Timetable Entries List */}
      {dayName === 'Sunday' ? (
        <div className="card-panel" style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏖️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Sunday Holiday</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
            No lectures scheduled for Sunday under GTU timetable version <b>{version.name}</b>.
          </p>
        </div>
      ) : entries.length === 0 ? (
        <div className="card-panel" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📅</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>No Timetable Entries Found</h3>
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
                  padding: '16px 20px',
                  background: isFree ? '#f8fafc' : '#ffffff',
                  border: isFree ? '1px dashed #cbd5e1' : isLab ? '1px solid #ddd6fe' : '1px solid var(--border-color)',
                  borderLeft: isFree ? '4px solid #94a3b8' : isLab ? '5px solid #7c3aed' : '5px solid var(--primary-blue)',
                  opacity: isFree ? 0.85 : 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                {/* Time & Subject Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '280px' }}>
                  <div style={{
                    minWidth: '100px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isFree ? '#e2e8f0' : isLab ? '#f3e8ff' : 'var(--primary-blue-light)',
                    color: isFree ? '#475569' : isLab ? '#7c3aed' : 'var(--primary-blue-hover)',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.8125rem'
                  }}>
                    <Clock size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {entry.startTime} – {entry.endTime}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: isFree ? '#475569' : 'var(--text-main)' }}>
                        {entry.subjectName}
                      </h3>

                      {!isFree && (
                        <span className={`badge-pill ${isLab ? 'badge-amber' : 'badge-blue'}`} style={{ background: isLab ? '#f3e8ff' : undefined, color: isLab ? '#7c3aed' : undefined, borderColor: isLab ? '#ddd6fe' : undefined }}>
                          {isLab ? <FlaskConical size={12} /> : <BookOpen size={12} />}
                          {isLab ? 'LAB (PRACTICAL)' : 'LECTURE (THEORY)'}
                        </span>
                      )}

                      {!isFree && (
                        <span className="badge-pill badge-grey">Batch {entry.batch}</span>
                      )}

                      {isFree && (
                        <span className="badge-pill badge-grey">FREE / EXCLUDED</span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span><MapPin size={12} style={{ verticalAlign: 'middle' }} /> Room: <b>{entry.room}</b></span>
                      <span><User size={12} style={{ verticalAlign: 'middle' }} /> Faculty: <b>{entry.faculty}</b></span>
                      {entry.notes && <span style={{ color: 'var(--warning-amber)' }}>ℹ️ {entry.notes}</span>}
                    </div>
                  </div>
                </div>

                {/* Attendance Marking Controls */}
                <div>
                  {isFree ? (
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 12px', background: '#f1f5f9', borderRadius: 'var(--radius-sm)' }}>
                      Free Period — Excluded
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => onMarkAttendance(selectedDate, version.id, entry.id, entry.subjectCode, 'PRESENT')}
                        className={`status-btn ${currentStatus === 'PRESENT' ? 'active-present' : ''}`}
                      >
                        <CheckCircle size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Present
                      </button>

                      <button
                        onClick={() => onMarkAttendance(selectedDate, version.id, entry.id, entry.subjectCode, 'ABSENT')}
                        className={`status-btn ${currentStatus === 'ABSENT' ? 'active-absent' : ''}`}
                      >
                        <XCircle size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        Absent
                      </button>

                      {currentStatus && (
                        <button
                          onClick={() => onMarkAttendance(selectedDate, version.id, entry.id, entry.subjectCode, 'CLEAR')}
                          className="btn btn-ghost"
                          style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                          title="Clear status"
                        >
                          <RotateCcw size={14} /> Clear
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
