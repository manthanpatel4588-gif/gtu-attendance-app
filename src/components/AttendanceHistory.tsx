import React, { useState } from 'react';
import { History, Filter, Download, Upload, Trash2, Calendar, Search } from 'lucide-react';
import { TimetableVersion, TimetableEntry, AttendanceRecord, SubjectCode } from '../types';
import { formatDateReadable, getDayOfWeek } from '../services/attendanceService';
import { SUBJECTS } from '../data/defaultData';

interface AttendanceHistoryProps {
  records: Record<string, AttendanceRecord>;
  versions: TimetableVersion[];
  allEntries: TimetableEntry[];
  onMarkAttendance: (date: string, versionId: string, entryId: string, subjectCode: any, status: 'PRESENT' | 'ABSENT' | 'CLEAR') => void;
  onClearAll: () => void;
  onImportRecords: (newRecords: Record<string, AttendanceRecord>) => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  records,
  versions,
  allEntries,
  onMarkAttendance,
  onClearAll,
  onImportRecords,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [versionFilter, setVersionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const entryMap = new Map(allEntries.map(e => [e.id, e]));
  const versionMap = new Map(versions.map(v => [v.id, v]));

  const recordList = Object.values(records).sort((a, b) => b.date.localeCompare(a.date) || b.timestamp - a.timestamp);

  const filteredRecords = recordList.filter(rec => {
    if (subjectFilter !== 'ALL' && rec.subjectCode !== subjectFilter) return false;
    if (statusFilter !== 'ALL' && rec.status !== statusFilter) return false;
    if (versionFilter !== 'ALL' && rec.timetable_version_id !== versionFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const entry = entryMap.get(rec.timetable_entry_id);
      const subName = entry ? entry.subjectName.toLowerCase() : '';
      const dateStr = rec.date.toLowerCase();
      if (!subName.includes(q) && !dateStr.includes(q) && !rec.subjectCode.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Export records to JSON file
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GTU_Attendance_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === 'object') {
            onImportRecords(parsed);
            alert('Attendance records imported successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="card-panel" style={{ background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Attendance History & Audit Logs</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Historical attendance records linked to date-wise timetable versions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={handleExport} className="btn btn-outline" style={{ fontSize: '0.8125rem' }}>
              <Download size={15} /> Export Backup
            </button>
            <label className="btn btn-outline" style={{ fontSize: '0.8125rem', cursor: 'pointer' }}>
              <Upload size={15} /> Import Backup
              <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
            </label>
            <button onClick={onClearAll} className="btn btn-danger" style={{ fontSize: '0.8125rem' }}>
              <Trash2 size={15} /> Reset All
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-panel" style={{ background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Filter size={18} color="var(--primary-blue)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>Filter Logs</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {/* Search */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Search Date / Subject:</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="e.g. 2026-08-03 or PDS"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Subject:</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                marginTop: '4px'
              }}
            >
              <option value="ALL">All Subjects</option>
              {Object.keys(SUBJECTS).filter(c => c !== 'FREE').map(c => (
                <option key={c} value={c}>{c} — {SUBJECTS[c].name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                marginTop: '4px'
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PRESENT">Present Only</option>
              <option value="ABSENT">Absent Only</option>
            </select>
          </div>

          {/* Version Filter */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Timetable Version:</label>
            <select
              value={versionFilter}
              onChange={(e) => setVersionFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem',
                marginTop: '4px'
              }}
            >
              <option value="ALL">All Timetable Versions</option>
              {versions.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            Attendance Records ({filteredRecords.length} entries)
          </h2>
        </div>

        {filteredRecords.length === 0 ? (
          <div style={{ textAlignment: 'center', padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <History size={40} style={{ margin: '0 auto 12px', display: 'block', color: '#cbd5e1' }} />
            <p style={{ fontWeight: 600 }}>No attendance records match the selected filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Day</th>
                  <th style={{ padding: '10px' }}>Timetable Version</th>
                  <th style={{ padding: '10px' }}>Subject</th>
                  <th style={{ padding: '10px' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => {
                  const entry = entryMap.get(rec.timetable_entry_id);
                  const ver = versionMap.get(rec.timetable_version_id);
                  const day = getDayOfWeek(rec.date);

                  return (
                    <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 700 }}>
                        {formatDateReadable(rec.date)}
                      </td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>{day}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={`badge-pill ${ver?.id === 'v1_old' ? 'badge-amber' : 'badge-green'}`}>
                          {ver?.name || rec.timetable_version_id}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 700 }}>{rec.subjectCode}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {entry?.subjectName || rec.subjectCode}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className={`badge-pill ${rec.status === 'PRESENT' ? 'badge-green' : 'badge-red'}`}>
                          {rec.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <button
                          onClick={() => onMarkAttendance(rec.date, rec.timetable_version_id, rec.timetable_entry_id, rec.subjectCode, 'CLEAR')}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--danger-red)',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          Remove Log
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
