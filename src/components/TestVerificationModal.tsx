import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, X, ArrowRight, Play } from 'lucide-react';
import { TimetableVersion } from '../types';
import { runAutomatedTestSuite } from '../services/attendanceService';

interface TestVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: TimetableVersion[];
  onSelectTestDate: (date: string) => void;
}

export const TestVerificationModal: React.FC<TestVerificationModalProps> = ({
  isOpen,
  onClose,
  versions,
  onSelectTestDate,
}) => {
  if (!isOpen) return null;

  const testResults = runAutomatedTestSuite(versions);
  const allPassed = testResults.every(t => t.passed);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="card-panel" style={{
        width: '100%',
        maxWidth: '680px',
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: allPassed ? '#f0fdf4' : '#fef2f2', color: allPassed ? '#166534' : '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Core Requirement Verification Suite</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Automated validation of Date-wise Timetable Versioning rules.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '6px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Status Summary Banner */}
        <div style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: allPassed ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${allPassed ? '#bbf7d0' : '#fecaca'}`,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {allPassed ? <CheckCircle2 size={24} color="#166534" /> : <XCircle size={24} color="#b91c1c" />}
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: allPassed ? '#166534' : '#991b1b' }}>
              {allPassed ? 'ALL TEST CASES PASSED (5 / 5)' : 'SOME TEST CASES FAILED'}
            </div>
            <div style={{ fontSize: '0.78125rem', color: allPassed ? '#15803d' : '#b91c1c' }}>
              {allPassed
                ? 'Date → Timetable Version → Weekday → B1 Filter pipeline is working strictly as requested!'
                : 'Please check date range mappings in defaultData.'}
            </div>
          </div>
        </div>

        {/* Test Cases Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {testResults.map((tr) => (
            <div
              key={tr.testId}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge-pill ${tr.passed ? 'badge-green' : 'badge-red'}`}>
                    {tr.testId}: {tr.date}
                  </span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    {tr.actualDay} → <span style={{ color: 'var(--primary-blue)' }}>{tr.actualVersionName}</span>
                  </h3>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Expected: <b>{tr.expectedVersionName} ({tr.expectedDay})</b> | Actual: <b>{tr.actualVersionName} ({tr.actualDay})</b>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: tr.passed ? '#166534' : '#991b1b' }}>
                  {tr.passed ? 'PASSED ✅' : 'FAILED ❌'}
                </span>
                <button
                  onClick={() => {
                    onSelectTestDate(tr.date);
                    onClose();
                  }}
                  className="btn btn-outline"
                  style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                >
                  <Play size={12} /> Test Live
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-primary">
            Close & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
