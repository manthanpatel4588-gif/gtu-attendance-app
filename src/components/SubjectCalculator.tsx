import React, { useState } from 'react';
import { BookOpen, FlaskConical, Calculator, Target } from 'lucide-react';
import { TimetableVersion, TimetableEntry, AttendanceRecord, JulyBaseline } from '../types';
import { calculateSubjectStats, calculateTargetGoalPlanner } from '../services/attendanceService';
import { SUBJECTS } from '../data/defaultData';

interface SubjectCalculatorProps {
  versions: TimetableVersion[];
  allEntries: TimetableEntry[];
  records: Record<string, AttendanceRecord>;
  julyBaseline?: JulyBaseline;
}

export const SubjectCalculator: React.FC<SubjectCalculatorProps> = ({
  versions,
  allEntries,
  records,
  julyBaseline = { enabled: true, percentage: 73, conducted: 85, present: 62, absent: 23 },
}) => {
  const subjectStats = calculateSubjectStats(records, versions, allEntries);

  // Target Goal Planner State
  const [targetGoalPercent, setTargetGoalPercent] = useState<number>(70);
  const targetPlan = calculateTargetGoalPlanner(julyBaseline, records, versions, allEntries, targetGoalPercent);

  // Interactive What-if Simulation State
  const [simSubject, setSimSubject] = useState<string>('PDS');
  const [simType, setSimType] = useState<'theory' | 'lab' | 'combined'>('theory');
  const [extraAttended, setExtraAttended] = useState<number>(0);
  const [extraMissed, setExtraMissed] = useState<number>(0);

  const selectedStat = subjectStats.find(s => s.code === simSubject) || subjectStats[0];
  const activeCategory = selectedStat ? selectedStat[simType] : { conducted: 0, present: 0, absent: 0, percentage: 0 };

  const projectedConducted = activeCategory.conducted + extraAttended + extraMissed;
  const projectedPresent = activeCategory.present + extraAttended;
  const projectedPercentage = projectedConducted > 0 ? (projectedPresent / projectedConducted) * 100 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '100%' }}>
      {/* Header */}
      <div className="card-panel" style={{ background: '#ffffff' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Subject-wise Lecture & Lab 75% Target Calculator</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginTop: '4px' }}>
          Calculated separately for Theory (Lectures) and Practical (Labs) per GTU academic rules.
        </p>
      </div>

      {/* Target Goal Planner Card */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '2px solid #bbf7d0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532d' }}>Combined Target Goal Planner (July + August → 01/09/2026)</h2>
            <p style={{ fontSize: '0.75rem', color: '#166534' }}>Calculate how many lectures you can miss in August to hit your target average!</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#14532d' }}>July Baseline (06/07 to 31/07):</label>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                73% Attendance ({julyBaseline.present} Present / {julyBaseline.conducted} Conducted)
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#14532d' }}>
                <span>Desired Target Overall % by 01/09: {targetGoalPercent}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={targetGoalPercent}
                onChange={(e) => setTargetGoalPercent(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#16a34a', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 700 }}>
              📊 TARGET STRATEGY:
            </div>

            <div style={{ fontSize: '0.8125rem', color: '#14532d', lineHeight: 1.5 }}>
              • July Baseline: <b>73%</b> ({julyBaseline.present}/{julyBaseline.conducted})<br />
              • Estimated August Lectures: <b>~{targetPlan.totalAugustLecturesEstimated} lectures</b><br />
              • Total Needed for <b>{targetGoalPercent}%</b> Overall: <b>{targetPlan.totalPresentNeededForTarget} lectures present</b><br />
              • <b style={{ color: '#16a34a' }}>August Present Needed: {targetPlan.augustPresentNeeded} lectures ({targetPlan.augustTargetRate}%)</b><br />
              • <b style={{ color: '#dc2626' }}>August Max Miss Allowed: Up to {targetPlan.augustMaxCanMiss} lectures</b>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Simulator */}
      <div className="card-panel" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', border: '2px solid var(--primary-blue-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Calculator size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Single Subject Simulator</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Simulate future theory lectures or lab sessions</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '16px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Select Subject:</label>
              <select
                value={simSubject}
                onChange={(e) => {
                  setSimSubject(e.target.value);
                  setExtraAttended(0);
                  setExtraMissed(0);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700
                }}
              >
                {subjectStats.map(s => (
                  <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Category:</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setSimType('theory')}
                  className={`btn ${simType === 'theory' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
                >
                  <BookOpen size={13} /> Lecture (Theory)
                </button>
                <button
                  type="button"
                  onClick={() => setSimType('lab')}
                  className={`btn ${simType === 'lab' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
                >
                  <FlaskConical size={13} /> Lab (Practical)
                </button>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px' }}>
                <span style={{ color: 'var(--success-green)' }}>Attend Next Sessions: {extraAttended}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={extraAttended}
                onChange={(e) => setExtraAttended(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--success-green)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '2px' }}>
                <span style={{ color: 'var(--danger-red)' }}>Miss Next Sessions: {extraMissed}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={extraMissed}
                onChange={(e) => setExtraMissed(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--danger-red)' }}
              />
            </div>
          </div>

          {/* Output Box */}
          <div style={{ background: '#ffffff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Projected {simType.toUpperCase()} Result for {simSubject}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: projectedPercentage >= 75 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                {Math.round(projectedPercentage * 100) / 100}%
              </div>
              <span className={`badge-pill ${projectedPercentage >= 75 ? 'badge-green' : 'badge-red'}`}>
                {projectedPercentage >= 75 ? 'ELIGIBLE (≥ 75%)' : 'SHORT ( < 75%)'}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Projected Conducted: <b>{projectedConducted}</b> | Projected Present: <b>{projectedPresent}</b>
            </div>
          </div>
        </div>
      </div>

      {/* All Subjects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
        {subjectStats.map((sub) => {
          const meta = SUBJECTS[sub.code] || { color: '#2563eb' };

          return (
            <div
              key={sub.code}
              className="card-panel"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                borderTop: `4px solid ${meta.color}`,
              }}
            >
              <div>
                <span className="badge-pill" style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}30` }}>
                  {sub.code}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '4px', color: 'var(--text-main)' }}>
                  {sub.name}
                </h3>
              </div>

              {/* Theory Box */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BookOpen size={14} /> Theory (Lecture) Attendance
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: sub.theory.conducted === 0 ? '#64748b' : sub.theory.percentage >= 75 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                    {sub.theory.conducted > 0 ? `${sub.theory.percentage}%` : 'N/A'}
                  </span>
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Conducted: <b>{sub.theory.conducted}</b> | Present: <b style={{ color: 'var(--success-green)' }}>{sub.theory.present}</b> | Absent: <b style={{ color: 'var(--danger-red)' }}>{sub.theory.absent}</b>
                </div>

                {sub.theory.conducted > 0 && (
                  <div style={{ marginTop: '4px', fontSize: '0.7rem', fontWeight: 600, color: sub.theory.percentage >= 75 ? '#166534' : '#991b1b' }}>
                    {sub.theory.percentage >= 75
                      ? `✅ Safe: Can miss ${sub.theory.canMissFor75} lecture(s)`
                      : `⚠️ Need ${sub.theory.neededFor75} consecutive lecture(s)`}
                  </div>
                )}
              </div>

              {/* Practical Box */}
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FlaskConical size={14} /> Practical (Lab) Attendance
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: sub.lab.conducted === 0 ? '#64748b' : sub.lab.percentage >= 75 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                    {sub.lab.conducted > 0 ? `${sub.lab.percentage}%` : 'N/A'}
                  </span>
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Conducted: <b>{sub.lab.conducted}</b> | Present: <b style={{ color: 'var(--success-green)' }}>{sub.lab.present}</b> | Absent: <b style={{ color: 'var(--danger-red)' }}>{sub.lab.absent}</b>
                </div>

                {sub.lab.conducted > 0 && (
                  <div style={{ marginTop: '4px', fontSize: '0.7rem', fontWeight: 600, color: sub.lab.percentage >= 75 ? '#166534' : '#991b1b' }}>
                    {sub.lab.percentage >= 75
                      ? `✅ Safe: Can miss ${sub.lab.canMissFor75} lab session(s)`
                      : `⚠️ Need ${sub.lab.neededFor75} consecutive lab session(s)`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
