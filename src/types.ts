export type StudentBatch = 'B1' | 'B2' | 'B3';

export interface JulyBaseline {
  enabled: boolean;
  percentage: number;
  conducted: number;
  present: number;
  absent: number;
}

export interface StudentProfile {
  name: string;
  enrollmentNo: string;
  branch: string;
  semester: string;
  batch: StudentBatch;
  university: string;
  institute: string;
  julyBaseline: JulyBaseline;
}

export interface TimetableVersion {
  id: string;
  name: string;
  wefDate: string; // e.g. "06-07-2026"
  effective_from: string; // "YYYY-MM-DD" e.g. "2026-01-01"
  effective_to: string | null; // "YYYY-MM-DD" or null for current/ongoing
  classroom: string;
  description: string;
}

export type SubjectCode = 'PDS' | 'SS' | 'MI' | 'CN' | 'WAD' | 'PM' | 'DATAENC' | 'FREE';

export interface SubjectInfo {
  code: SubjectCode;
  name: string;
  color: string;
  iconName: string;
}

export interface TimetableEntry {
  id: string;
  version_id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "08:30"
  endTime: string;   // e.g. "09:25"
  subjectCode: SubjectCode;
  subjectName: string;
  type: 'Theory' | 'Practical' | 'Tutorial' | 'Free';
  batch: 'ALL' | 'B1' | 'B2' | 'B3';
  room: string;
  faculty: string;
  isEligibleForB1: boolean;
  notes?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  timetable_version_id: string;
  timetable_entry_id: string;
  subjectCode: SubjectCode;
  status: AttendanceStatus;
  timestamp: number;
}

export interface AttendanceCategoryStats {
  conducted: number;
  present: number;
  absent: number;
  percentage: number;
  neededFor75: number;
  canMissFor75: number;
}

export interface SubjectStats {
  code: SubjectCode;
  name: string;
  theory: AttendanceCategoryStats;
  lab: AttendanceCategoryStats;
  combined: AttendanceCategoryStats;
}

export interface DaySummary {
  dayName: string;
  dateStr?: string;
  theoryConducted: number;
  theoryPresent: number;
  theoryAbsent: number;
  labConducted: number;
  labPresent: number;
  labAbsent: number;
  totalConducted: number;
  totalPresent: number;
  totalAbsent: number;
  percentage: number;
}

export interface TestResult {
  testId: string;
  title: string;
  date: string;
  expectedDay: string;
  expectedVersionId: string;
  expectedVersionName: string;
  actualDay: string;
  actualVersionId: string;
  actualVersionName: string;
  passed: boolean;
  notes: string;
}
