import React, { useState } from 'react';
import { Save, RotateCcw, Target, Calendar } from 'lucide-react';
import { StudentProfile, StudentBatch } from '../types';

interface SettingsModalProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
  onResetFactory: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  student,
  onUpdateStudent,
  onResetFactory,
}) => {
  const [profile, setProfile] = useState<StudentProfile>(student);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent(profile);
    alert('Student profile, batch & July baseline settings saved!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card-panel" style={{ background: '#ffffff' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Student Profile & Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Configure GTU student details, batch allocations, and July baseline carry-forward data.
        </p>
      </div>

      {/* Profile Form */}
      <div className="card-panel">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Student Profile Information</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Student Name:</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Enrollment Number:</label>
              <input
                type="text"
                value={profile.enrollmentNo}
                onChange={(e) => setProfile({ ...profile, enrollmentNo: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Branch:</label>
              <input
                type="text"
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Semester:</label>
              <input
                type="text"
                value={profile.semester}
                onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginTop: '4px' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-blue)' }}>Assigned Batch:</label>
              <select
                value={profile.batch}
                onChange={(e) => setProfile({ ...profile, batch: e.target.value as StudentBatch })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary-blue-border)', marginTop: '4px', fontWeight: 700 }}
              >
                <option value="B1">B1 (Default Student Batch)</option>
                <option value="B2">B2</option>
                <option value="B3">B3</option>
              </select>
            </div>
          </div>

          {/* July Baseline Attendance Carry-Forward */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#166534" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#14532d' }}>
                  July Baseline Attendance Carry-Forward (06/07 to 31/07)
                </h3>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 700, color: '#166534', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={profile.julyBaseline.enabled}
                  onChange={(e) => setProfile({
                    ...profile,
                    julyBaseline: { ...profile.julyBaseline, enabled: e.target.checked }
                  })}
                />
                Include July Baseline in Combined %
              </label>
            </div>

            {profile.julyBaseline.enabled && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>July Attendance %:</label>
                  <input
                    type="number"
                    value={profile.julyBaseline.percentage}
                    onChange={(e) => setProfile({
                      ...profile,
                      julyBaseline: { ...profile.julyBaseline, percentage: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', marginTop: '2px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>July Conducted Lectures:</label>
                  <input
                    type="number"
                    value={profile.julyBaseline.conducted}
                    onChange={(e) => setProfile({
                      ...profile,
                      julyBaseline: { ...profile.julyBaseline, conducted: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', marginTop: '2px', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>July Present Lectures:</label>
                  <input
                    type="number"
                    value={profile.julyBaseline.present}
                    onChange={(e) => setProfile({
                      ...profile,
                      julyBaseline: { ...profile.julyBaseline, present: Number(e.target.value) }
                    })}
                    style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', marginTop: '2px', fontWeight: 700 }}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Profile Settings
            </button>
          </div>
        </form>
      </div>

      <div className="card-panel" style={{ border: '1px solid #fecaca', background: '#fef2f2' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>Danger Zone: Factory Reset</h2>
        <p style={{ fontSize: '0.8125rem', color: '#7f1d1d', marginBottom: '14px' }}>
          Resetting will clear all local storage attendance logs and restore default timetable versions.
        </p>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all data to default GTU timetable settings?')) {
              onResetFactory();
            }
          }}
          className="btn btn-danger"
        >
          <RotateCcw size={16} /> Reset All System Data
        </button>
      </div>
    </div>
  );
};
