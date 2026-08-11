import React, { useState } from 'react';
import { Clock, Plus, Calendar, Layers, ShieldCheck, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { TimetableVersion, TimetableEntry, StudentBatch } from '../types';
import { SUBJECTS } from '../data/defaultData';

interface TimetableHistoryProps {
  versions: TimetableVersion[];
  allEntries: TimetableEntry[];
  studentBatch: StudentBatch;
  onAddVersion: (newVer: TimetableVersion) => void;
}

export const TimetableHistory: React.FC<TimetableHistoryProps> = ({
  versions,
  allEntries,
  studentBatch,
  onAddVersion,
}) => {
  const [selectedVerId, setSelectedVerId] = useState<string>(versions[0]?.id || 'v1_old');
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  
  // Modal for creating new timetable version
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newVerName, setNewVerName] = useState<string>('TIMETABLE 3');
  const [newWefDate, setNewWefDate] = useState<string>('01-09-2026');
  const [newFromDate, setNewFromDate] = useState<string>('2026-09-01');
  const [newClassroom, setNewClassroom] = useState<string>('248-B');
  const [newDesc, setNewDesc] = useState<string>('Mid-Semester Revised Timetable');

  const activeVersion = versions.find(v => v.id === selectedVerId) || versions[0];
  const entriesForVerAndDay = allEntries.filter(
    e => e.version_id === selectedVerId && e.day === selectedDay
  );

  const handleCreateVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFromDate || !newVerName) return;

    const newId = `v${versions.length + 1}_${Date.now()}`;
    const newVersion: TimetableVersion = {
      id: newId,
      name: newVerName,
      wefDate: newWefDate,
      effective_from: newFromDate,
      effective_to: null,
      classroom: newClassroom,
      description: newDesc,
    };

    onAddVersion(newVersion);
    setSelectedVerId(newId);
    setShowAddModal(false);
    alert(`Successfully added ${newVerName} starting ${newFromDate}!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="card-panel" style={{ background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Timetable Versioning & History</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Historical GTU timetable architecture. Past attendance logs remain permanently bound to their date's version.
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
            <Plus size={16} /> Add Future Timetable Version
          </button>
        </div>
      </div>

      {/* Version Cards List */}
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>Configured Timetable Versions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {versions.map((ver) => {
            const isSelected = ver.id === selectedVerId;
            return (
              <div
                key={ver.id}
                onClick={() => setSelectedVerId(ver.id)}
                className="card-panel"
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  background: isSelected ? 'var(--primary-blue-light)' : '#ffffff',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className={`badge-pill ${ver.id === 'v1_old' ? 'badge-amber' : 'badge-green'}`}>
                    {ver.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    W.E.F. {ver.wefDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0' }}>
                  Room No: {ver.classroom}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {ver.description}
                </p>

                <div style={{ fontSize: '0.75rem', padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#ffffff', border: '1px solid var(--border-color)', fontWeight: 600 }}>
                  📅 Effective: <b>{ver.effective_from}</b> → <b>{ver.effective_to || 'Present (Ongoing)'}</b>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timetable Schedule Viewer */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              Viewing Schedule: <span style={{ color: 'var(--primary-blue)' }}>{activeVersion.name}</span>
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Class Room {activeVersion.classroom} • Effective from {activeVersion.effective_from}
            </p>
          </div>

          {/* Weekday Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  background: selectedDay === d ? 'var(--primary-blue)' : '#ffffff',
                  color: selectedDay === d ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Timetable Entries Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px' }}>Time Slot</th>
                <th style={{ padding: '10px' }}>Subject</th>
                <th style={{ padding: '10px' }}>Type</th>
                <th style={{ padding: '10px' }}>Batch Applicability</th>
                <th style={{ padding: '10px' }}>Faculty</th>
                <th style={{ padding: '10px' }}>Room</th>
                <th style={{ padding: '10px' }}>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {entriesForVerAndDay.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No lecture entries configured for {selectedDay} in {activeVersion.name}.
                  </td>
                </tr>
              ) : (
                entriesForVerAndDay.map((e) => {
                  const isEligibleB1 = e.isEligibleForB1 && e.subjectCode !== 'FREE' && e.type !== 'Free';
                  return (
                    <tr key={e.id} style={{ borderBottom: '1px solid var(--border-color)', background: isEligibleB1 ? 'transparent' : '#f8fafc' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>{e.startTime} – {e.endTime}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 800 }}>{e.subjectCode}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.subjectName}</div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge-pill badge-grey">{e.type}</span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={`badge-pill ${e.batch === 'B1' || e.batch === 'ALL' ? 'badge-blue' : 'badge-grey'}`}>
                          Batch: {e.batch}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>{e.faculty}</td>
                      <td style={{ padding: '12px 10px' }}>{e.room}</td>
                      <td style={{ padding: '12px 10px' }}>
                        {isEligibleB1 ? (
                          <span className="badge-pill badge-green">Counts for B1 %</span>
                        ) : (
                          <span className="badge-pill badge-grey">Free / Excluded</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Version Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div className="card-panel" style={{ width: '100%', maxWidth: '500px', background: '#ffffff', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>Add Future Timetable Version</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Create Timetable 3 or future revision. Existing records will remain intact.
            </p>

            <form onSubmit={handleCreateVersion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Version Name:</label>
                <input
                  type="text"
                  value={newVerName}
                  onChange={(e) => setNewVerName(e.target.value)}
                  placeholder="e.g. TIMETABLE 3"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Effective From Date (YYYY-MM-DD):</label>
                <input
                  type="date"
                  value={newFromDate}
                  onChange={(e) => setNewFromDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>W.E.F. Date String:</label>
                <input
                  type="text"
                  value={newWefDate}
                  onChange={(e) => setNewWefDate(e.target.value)}
                  placeholder="e.g. 01-09-2026"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Classroom No:</label>
                <input
                  type="text"
                  value={newClassroom}
                  onChange={(e) => setNewClassroom(e.target.value)}
                  placeholder="e.g. 248-B"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Description:</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Mid-Sem Revision"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
