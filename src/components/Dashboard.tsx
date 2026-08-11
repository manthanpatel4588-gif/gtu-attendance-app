import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Target,
  Sparkles
} from 'lucide-react';
import { StudentProfile, TimetableVersion, TimetableEntry, AttendanceRecord } from '../types';
import { calculateOverallStats, calculateSubjectStats, getWeeklySummary, formatDateReadable, calculateTargetGoalPlanner } from '../services/attendanceService';
import { SUBJECTS } from '../data/defaultData';

interface DashboardProps {
  student: StudentProfile;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  versions: TimetableVersion[];
  allEntries: TimetableEntry[];
  records: Record<string, AttendanceRecord>;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  student,
  selectedDate,
  setSelectedDate,
  versions,
  allEntries,
  records,
  setActiveTab,
}) => {
  const overall = calculateOverallStats(records, versions, allEntries, student.julyBaseline);
  const subjectStats = calculateSubjectStats(records, versions, allEntries);
  const weeklySummary = getWeeklySummary(selectedDate, records, versions, allEntries);
  const targetPlan = calculateTargetGoalPlanner(student.julyBaseline, records, versions, allEntries, 70);

  const isTheorySafe = overall.theory.percentage >= 75;
  const isLabSafe = overall.lab.percentage >= 75;
  const isCombinedSafe = overall.combined.percentage >= 75;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%' }}>
      {/* Top Banner & Date Switcher */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge-pill badge-blue">GTU Computer Engineering</span>
              <span className="badge-pill badge-grey">Sem V-B • Batch {student.batch}</span>
              <span className="badge-pill badge-green">July 73% Loaded</span>
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Attendance Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '2px' }}>
              Real-time attendance tracking & 1st September ~70% Target Goal Planner.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', width: '100%', maxWidth: '340px' }}>
            <Calendar size={18} color="var(--primary-blue)" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE DATE</div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)', cursor: 'pointer', width: '100%' }}
              />
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="btn btn-primary"
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            >
              Mark <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Target Goal Planner Banner */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '2px solid #bbf7d0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#14532d' }}>
                  Target Goal: ~70% Attendance by 1st September (01/09/2026)
                </h2>
                <span className="badge-pill badge-green">CALCULATED</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#166534', marginTop: '2px' }}>
                July Baseline (06/07 to 31/07): <b>73% Attendance</b> (62 Present / 85 Conducted)
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '10px' }}>
            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 700 }}>AUGUST PRESENT NEEDED</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                {targetPlan.augustPresentNeeded} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534' }}>({targetPlan.augustTargetRate}%)</span>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 700 }}>MAX AUGUST MISS ALLOWED</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>
                Up to {targetPlan.augustMaxCanMiss} lectures
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '14px' }}>
        {/* Lecture (Theory) Attendance */}
        <div className="card-panel" style={{ borderLeft: `5px solid ${overall.theory.conducted === 0 ? '#94a3b8' : isTheorySafe ? 'var(--success-green)' : 'var(--danger-red)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={16} color="var(--primary-blue)" /> Lecture (Theory) %
            </span>
            <span className={`badge-pill ${overall.theory.conducted === 0 ? 'badge-grey' : isTheorySafe ? 'badge-green' : 'badge-red'}`}>
              {overall.theory.conducted === 0 ? 'No Data' : isTheorySafe ? 'SAFE' : 'WARNING'}
            </span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: overall.theory.conducted === 0 ? 'var(--text-muted)' : isTheorySafe ? 'var(--success-green)' : 'var(--danger-red)' }}>
            {overall.theory.conducted > 0 ? `${overall.theory.percentage}%` : '0%'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Conducted: <b>{overall.theory.conducted}</b></span>
            <span>Present: <b style={{ color: 'var(--success-green)' }}>{overall.theory.present}</b></span>
            <span>Absent: <b style={{ color: 'var(--danger-red)' }}>{overall.theory.absent}</b></span>
          </div>
        </div>

        {/* Lab (Practical) Attendance */}
        <div className="card-panel" style={{ borderLeft: `5px solid ${overall.lab.conducted === 0 ? '#94a3b8' : isLabSafe ? 'var(--success-green)' : 'var(--danger-red)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FlaskConical size={16} color="#7c3aed" /> Lab (Practical) %
            </span>
            <span className={`badge-pill ${overall.lab.conducted === 0 ? 'badge-grey' : isLabSafe ? 'badge-green' : 'badge-red'}`}>
              {overall.lab.conducted === 0 ? 'No Data' : isLabSafe ? 'SAFE' : 'WARNING'}
            </span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: overall.lab.conducted === 0 ? 'var(--text-muted)' : isLabSafe ? 'var(--success-green)' : 'var(--danger-red)' }}>
            {overall.lab.conducted > 0 ? `${overall.lab.percentage}%` : '0%'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Conducted: <b>{overall.lab.conducted}</b></span>
            <span>Present: <b style={{ color: 'var(--success-green)' }}>{overall.lab.present}</b></span>
            <span>Absent: <b style={{ color: 'var(--danger-red)' }}>{overall.lab.absent}</b></span>
          </div>
        </div>

        {/* Combined Overall Attendance */}
        <div className="card-panel" style={{ borderLeft: `5px solid ${overall.combined.conducted === 0 ? '#94a3b8' : isCombinedSafe ? 'var(--success-green)' : 'var(--danger-red)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={16} color="var(--primary-blue)" /> Combined (July + Aug) %
            </span>
            <span className={`badge-pill ${overall.combined.conducted === 0 ? 'badge-grey' : isCombinedSafe ? 'badge-green' : 'badge-red'}`}>
              {overall.combined.conducted === 0 ? 'No Data' : isCombinedSafe ? 'SAFE' : 'WARNING'}
            </span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: overall.combined.conducted === 0 ? 'var(--text-muted)' : isCombinedSafe ? 'var(--success-green)' : 'var(--danger-red)' }}>
            {overall.combined.conducted > 0 ? `${overall.combined.percentage}%` : '0%'}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Total Conducted: <b>{overall.combined.conducted}</b></span>
            <span>Present: <b style={{ color: 'var(--success-green)' }}>{overall.combined.present}</b></span>
            <span>Absent: <b style={{ color: 'var(--danger-red)' }}>{overall.combined.absent}</b></span>
          </div>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Subject-wise Lecture & Lab Breakdown</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Theory lectures and Practical labs calculated separately per course.
            </p>
          </div>
          <button onClick={() => setActiveTab('subjects')} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '6px 10px' }}>
            Subject Calculator <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
          {subjectStats.map((sub) => {
            const meta = SUBJECTS[sub.code] || { color: '#2563eb' };

            return (
              <div
                key={sub.code}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  background: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div>
                  <span className="badge-pill" style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}40`, marginBottom: '4px' }}>
                    {sub.code}
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {sub.name}
                  </h3>
                </div>

                {/* Theory Box */}
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} /> LECTURE (THEORY)
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: sub.theory.conducted === 0 ? '#64748b' : sub.theory.percentage >= 75 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                      {sub.theory.conducted > 0 ? `${sub.theory.percentage}%` : 'N/A'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Conducted: <b>{sub.theory.conducted}</b> | Present: <b style={{ color: 'var(--success-green)' }}>{sub.theory.present}</b> | Absent: <b style={{ color: 'var(--danger-red)' }}>{sub.theory.absent}</b>
                  </div>
                </div>

                {/* Practical Box */}
                <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FlaskConical size={12} /> LAB (PRACTICAL)
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: sub.lab.conducted === 0 ? '#64748b' : sub.lab.percentage >= 75 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                      {sub.lab.conducted > 0 ? `${sub.lab.percentage}%` : 'N/A'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    Conducted: <b>{sub.lab.conducted}</b> | Present: <b style={{ color: 'var(--success-green)' }}>{sub.lab.present}</b> | Absent: <b style={{ color: 'var(--danger-red)' }}>{sub.lab.absent}</b>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
