import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Dashboard } from './components/Dashboard';
import { DayAttendance } from './components/DayAttendance';
import { SubjectCalculator } from './components/SubjectCalculator';
import { AttendanceHistory } from './components/AttendanceHistory';
import { TimetableHistory } from './components/TimetableHistory';
import { SettingsModal } from './components/SettingsModal';
import { TestVerificationModal } from './components/TestVerificationModal';

import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_TIMETABLE_VERSIONS, 
  INITIAL_TIMETABLE_ENTRIES, 
  INITIAL_ATTENDANCE_RECORDS 
} from './data/defaultData';
import { StudentProfile, TimetableVersion, TimetableEntry, AttendanceRecord } from './types';

const SCHEMA_VERSION = 'gtu_schema_v5_july_baseline';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-11'); // Today's date
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  // Persistent State with schema version check
  const [student, setStudent] = useState<StudentProfile>(() => {
    const currentVer = localStorage.getItem('gtu_schema_ver');
    if (currentVer !== SCHEMA_VERSION) {
      localStorage.setItem('gtu_schema_ver', SCHEMA_VERSION);
      localStorage.setItem('gtu_student_profile', JSON.stringify(INITIAL_STUDENT_PROFILE));
      localStorage.setItem('gtu_timetable_versions', JSON.stringify(INITIAL_TIMETABLE_VERSIONS));
      localStorage.setItem('gtu_timetable_entries', JSON.stringify(INITIAL_TIMETABLE_ENTRIES));
      localStorage.setItem('gtu_attendance_records', JSON.stringify(INITIAL_ATTENDANCE_RECORDS));
      return INITIAL_STUDENT_PROFILE;
    }
    const saved = localStorage.getItem('gtu_student_profile');
    if (!saved) return INITIAL_STUDENT_PROFILE;
    const parsed = JSON.parse(saved);
    if (!parsed.julyBaseline) {
      parsed.julyBaseline = INITIAL_STUDENT_PROFILE.julyBaseline;
    }
    return parsed;
  });

  const [versions, setVersions] = useState<TimetableVersion[]>(() => {
    const saved = localStorage.getItem('gtu_timetable_versions');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE_VERSIONS;
  });

  const [allEntries, setAllEntries] = useState<TimetableEntry[]>(() => {
    const saved = localStorage.getItem('gtu_timetable_entries');
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE_ENTRIES;
  });

  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(() => {
    const saved = localStorage.getItem('gtu_attendance_records');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gtu_student_profile', JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem('gtu_timetable_versions', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('gtu_timetable_entries', JSON.stringify(allEntries));
  }, [allEntries]);

  useEffect(() => {
    localStorage.setItem('gtu_attendance_records', JSON.stringify(records));
  }, [records]);

  // Attendance Marking Handler
  const handleMarkAttendance = (
    date: string,
    versionId: string,
    entryId: string,
    subjectCode: any,
    status: 'PRESENT' | 'ABSENT' | 'CLEAR'
  ) => {
    const key = `${date}_${entryId}`;
    setRecords(prev => {
      const copy = { ...prev };
      if (status === 'CLEAR') {
        delete copy[key];
      } else {
        copy[key] = {
          id: key,
          student_id: student.enrollmentNo,
          date,
          timetable_version_id: versionId,
          timetable_entry_id: entryId,
          subjectCode,
          status,
          timestamp: Date.now(),
        };
      }
      return copy;
    });
  };

  // Bulk Marking Handler
  const handleBulkMark = (
    date: string,
    versionId: string,
    entries: TimetableEntry[],
    status: 'PRESENT' | 'ABSENT'
  ) => {
    setRecords(prev => {
      const copy = { ...prev };
      entries.forEach(e => {
        const key = `${date}_${e.id}`;
        copy[key] = {
          id: key,
          student_id: student.enrollmentNo,
          date,
          timetable_version_id: versionId,
          timetable_entry_id: e.id,
          subjectCode: e.subjectCode,
          status,
          timestamp: Date.now(),
        };
      });
      return copy;
    });
  };

  // Add New Timetable Version
  const handleAddVersion = (newVer: TimetableVersion) => {
    setVersions(prev => {
      const updated = prev.map(v => {
        if (v.effective_to === null) {
          const newFromDate = new Date(`${newVer.effective_from}T12:00:00`);
          newFromDate.setDate(newFromDate.getDate() - 1);
          return { ...v, effective_to: newFromDate.toISOString().split('T')[0] };
        }
        return v;
      });
      return [...updated, newVer];
    });
  };

  // Reset Factory Defaults
  const handleResetFactory = () => {
    localStorage.clear();
    localStorage.setItem('gtu_schema_ver', SCHEMA_VERSION);
    setStudent(INITIAL_STUDENT_PROFILE);
    setVersions(INITIAL_TIMETABLE_VERSIONS);
    setAllEntries(INITIAL_TIMETABLE_ENTRIES);
    setRecords(INITIAL_ATTENDANCE_RECORDS);
    alert('System data reset to factory default GTU timetables.');
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onOpenTestModal={() => setIsTestModalOpen(true)}
      />

      {/* Mobile Top & Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onOpenTestModal={() => setIsTestModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            student={student}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            versions={versions}
            allEntries={allEntries}
            records={records}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'attendance' && (
          <DayAttendance
            student={student}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            versions={versions}
            allEntries={allEntries}
            records={records}
            onMarkAttendance={handleMarkAttendance}
            onBulkMark={handleBulkMark}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectCalculator
            versions={versions}
            allEntries={allEntries}
            records={records}
            julyBaseline={student.julyBaseline}
          />
        )}

        {activeTab === 'history' && (
          <AttendanceHistory
            records={records}
            versions={versions}
            allEntries={allEntries}
            onMarkAttendance={handleMarkAttendance}
            onClearAll={() => setRecords({})}
            onImportRecords={(imported) => setRecords(imported)}
          />
        )}

        {activeTab === 'timetables' && (
          <TimetableHistory
            versions={versions}
            allEntries={allEntries}
            studentBatch={student.batch}
            onAddVersion={handleAddVersion}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsModal
            student={student}
            onUpdateStudent={setStudent}
            onResetFactory={handleResetFactory}
          />
        )}
      </main>

      {/* Verification Suite Modal */}
      <TestVerificationModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        versions={versions}
        onSelectTestDate={(d) => {
          setSelectedDate(d);
          setActiveTab('attendance');
        }}
      />
    </div>
  );
}

export default App;
