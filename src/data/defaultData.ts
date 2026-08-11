import { StudentProfile, TimetableVersion, TimetableEntry, SubjectInfo, AttendanceRecord } from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Computer Engineering Student',
  enrollmentNo: '240670107082',
  branch: 'Computer Engineering (CE)',
  semester: 'V-B',
  batch: 'B1',
  university: 'Gujarat Technological University (GTU)',
  institute: 'SAL Institute of Technology & Engineering Research (SAL Education Campus)',
  julyBaseline: {
    enabled: true,
    percentage: 73,
    conducted: 85,
    present: 62,
    absent: 23,
  },
};

export const SUBJECTS: Record<string, SubjectInfo> = {
  PDS: { code: 'PDS', name: 'Python for Data Science', color: '#2563eb', iconName: 'FileCode2' },
  SS: { code: 'SS', name: 'System Software', color: '#7c3aed', iconName: 'Cpu' },
  MI: { code: 'MI', name: 'Microprocessor and Interfacing', color: '#059669', iconName: 'CircuitBoard' },
  CN: { code: 'CN', name: 'Computer Networks', color: '#d97706', iconName: 'Network' },
  WAD: { code: 'WAD', name: 'Web Application Development', color: '#0891b2', iconName: 'Globe' },
  PM: { code: 'PM', name: 'Project Management', color: '#dc2626', iconName: 'Kanban' },
  DATAENC: { code: 'DATAENC', name: 'Data Encryption', color: '#4f46e5', iconName: 'Lock' },
  FREE: { code: 'FREE', name: 'Free / Break / Library', color: '#9ca3af', iconName: 'Coffee' },
};

export const INITIAL_TIMETABLE_VERSIONS: TimetableVersion[] = [
  {
    id: 'v1_old',
    name: 'OLD TIMETABLE',
    wefDate: '06-07-2026',
    effective_from: '2026-01-01',
    effective_to: '2026-08-09',
    classroom: '248',
    description: 'SAL Education Campus • W.E.F. 06-07-2026 (Applicable for dates BEFORE 10-08-2026)',
  },
  {
    id: 'v2_new',
    name: 'NEW TIMETABLE',
    wefDate: '10-08-2026',
    effective_from: '2026-08-10',
    effective_to: null,
    classroom: '248',
    description: 'SAL Education Campus • W.E.F. 10-08-2026 (Effective 10-08-2026 ONWARD)',
  },
];

export const INITIAL_TIMETABLE_ENTRIES: TimetableEntry[] = [
  // =========================================================================
  // OLD TIMETABLE (v1_old) - APPLICABLE BEFORE 10-08-2026 (W.E.F. 06-07-2026)
  // =========================================================================

  // MONDAY (v1_old)
  { id: 'v1_mon_1_free', version_id: 'v1_old', day: 'Monday', startTime: '08:30', endTime: '09:25', subjectCode: 'FREE', subjectName: 'PM() (209) - Free Lecture', type: 'Free', batch: 'ALL', room: '209', faculty: '-', isEligibleForB1: false, notes: 'PM() with no faculty code in brackets' },
  { id: 'v1_mon_2', version_id: 'v1_old', day: 'Monday', startTime: '09:25', endTime: '10:20', subjectCode: 'PDS', subjectName: 'Python for Data Science (PDS - VS)', type: 'Theory', batch: 'ALL', room: '209', faculty: 'VS', isEligibleForB1: true },
  { id: 'v1_mon_break1', version_id: 'v1_old', day: 'Monday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_mon_3', version_id: 'v1_old', day: 'Monday', startTime: '10:30', endTime: '11:30', subjectCode: 'WAD', subjectName: 'Web Application Development (WAD - LK)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'LK', isEligibleForB1: true },
  { id: 'v1_mon_4', version_id: 'v1_old', day: 'Monday', startTime: '11:30', endTime: '12:30', subjectCode: 'CN', subjectName: 'Computer Networks (CN - JP)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'JP', isEligibleForB1: true },
  { id: 'v1_mon_break2', version_id: 'v1_old', day: 'Monday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_mon_5_b1', version_id: 'v1_old', day: 'Monday', startTime: '01:00', endTime: '03:00', subjectCode: 'PDS', subjectName: 'PDS Practical (B1)', type: 'Practical', batch: 'B1', room: '221B', faculty: 'VS', isEligibleForB1: true },

  // TUESDAY (v1_old)
  { id: 'v1_tue_1_b1', version_id: 'v1_old', day: 'Tuesday', startTime: '08:30', endTime: '10:20', subjectCode: 'CN', subjectName: 'CN Practical (B1)', type: 'Practical', batch: 'B1', room: '221A', faculty: 'JP', isEligibleForB1: true },
  { id: 'v1_tue_break1', version_id: 'v1_old', day: 'Tuesday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_tue_2', version_id: 'v1_old', day: 'Tuesday', startTime: '10:30', endTime: '11:30', subjectCode: 'PM', subjectName: 'Project Management (PM - SM)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'SM', isEligibleForB1: true },
  { id: 'v1_tue_3', version_id: 'v1_old', day: 'Tuesday', startTime: '11:30', endTime: '12:30', subjectCode: 'CN', subjectName: 'Computer Networks (CN - JP)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'JP', isEligibleForB1: true },
  { id: 'v1_tue_break2', version_id: 'v1_old', day: 'Tuesday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_tue_4', version_id: 'v1_old', day: 'Tuesday', startTime: '01:00', endTime: '02:00', subjectCode: 'WAD', subjectName: 'Web Application Development (WAD - LK)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'LK', isEligibleForB1: true },
  { id: 'v1_tue_5', version_id: 'v1_old', day: 'Tuesday', startTime: '02:00', endTime: '03:00', subjectCode: 'MI', subjectName: 'Microprocessor and Interfacing (MI - RJ)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'RJ', isEligibleForB1: true },

  // WEDNESDAY (v1_old)
  { id: 'v1_wed_1_b1', version_id: 'v1_old', day: 'Wednesday', startTime: '08:30', endTime: '10:20', subjectCode: 'MI', subjectName: 'MI Practical (B1)', type: 'Practical', batch: 'B1', room: '221D', faculty: 'RJ', isEligibleForB1: true },
  { id: 'v1_wed_break1', version_id: 'v1_old', day: 'Wednesday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_wed_2', version_id: 'v1_old', day: 'Wednesday', startTime: '10:30', endTime: '11:30', subjectCode: 'CN', subjectName: 'Computer Networks (CN - JP)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'JP', isEligibleForB1: true },
  { id: 'v1_wed_3', version_id: 'v1_old', day: 'Wednesday', startTime: '11:30', endTime: '12:30', subjectCode: 'SS', subjectName: 'System Software (SS - HR)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'HR', isEligibleForB1: true },
  { id: 'v1_wed_break2', version_id: 'v1_old', day: 'Wednesday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_wed_4', version_id: 'v1_old', day: 'Wednesday', startTime: '01:00', endTime: '02:00', subjectCode: 'PDS', subjectName: 'Python for Data Science (PDS - VS)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'VS', isEligibleForB1: true },
  { id: 'v1_wed_5', version_id: 'v1_old', day: 'Wednesday', startTime: '02:00', endTime: '03:00', subjectCode: 'FREE', subjectName: 'LIBRARY', type: 'Free', batch: 'ALL', room: 'Library', faculty: '-', isEligibleForB1: false },

  // THURSDAY (v1_old)
  { id: 'v1_thu_1_b1', version_id: 'v1_old', day: 'Thursday', startTime: '08:30', endTime: '10:20', subjectCode: 'SS', subjectName: 'SS Practical (B1)', type: 'Practical', batch: 'B1', room: '221D', faculty: 'HS', isEligibleForB1: true },
  { id: 'v1_thu_break1', version_id: 'v1_old', day: 'Thursday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_thu_2', version_id: 'v1_old', day: 'Thursday', startTime: '10:30', endTime: '11:30', subjectCode: 'SS', subjectName: 'System Software (SS - HR)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'HR', isEligibleForB1: true },
  { id: 'v1_thu_3', version_id: 'v1_old', day: 'Thursday', startTime: '11:30', endTime: '12:30', subjectCode: 'WAD', subjectName: 'Web Application Development (WAD - PH)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'PH', isEligibleForB1: true },
  { id: 'v1_thu_break2', version_id: 'v1_old', day: 'Thursday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_thu_4', version_id: 'v1_old', day: 'Thursday', startTime: '01:00', endTime: '02:00', subjectCode: 'SS', subjectName: 'System Software (SS - HS)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'HS', isEligibleForB1: true },
  { id: 'v1_thu_5', version_id: 'v1_old', day: 'Thursday', startTime: '02:00', endTime: '03:00', subjectCode: 'MI', subjectName: 'Microprocessor and Interfacing (MI - RJ)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'RJ', isEligibleForB1: true },

  // FRIDAY (v1_old)
  { id: 'v1_fri_1', version_id: 'v1_old', day: 'Friday', startTime: '08:30', endTime: '09:25', subjectCode: 'PM', subjectName: 'Project Management (PM - SM)', type: 'Theory', batch: 'ALL', room: '203', faculty: 'SM', isEligibleForB1: true },
  { id: 'v1_fri_2', version_id: 'v1_old', day: 'Friday', startTime: '09:25', endTime: '10:20', subjectCode: 'MI', subjectName: 'Microprocessor and Interfacing (MI - RJ)', type: 'Theory', batch: 'ALL', room: '203', faculty: 'RJ', isEligibleForB1: true },
  { id: 'v1_fri_break1', version_id: 'v1_old', day: 'Friday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_fri_3_b1', version_id: 'v1_old', day: 'Friday', startTime: '10:30', endTime: '12:30', subjectCode: 'WAD', subjectName: 'WAD Practical (B1)', type: 'Practical', batch: 'B1', room: '221B', faculty: 'PH', isEligibleForB1: true },
  { id: 'v1_fri_break2', version_id: 'v1_old', day: 'Friday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_fri_4', version_id: 'v1_old', day: 'Friday', startTime: '01:00', endTime: '02:00', subjectCode: 'PDS', subjectName: 'Python for Data Science (PDS - VS)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'VS', isEligibleForB1: true },
  { id: 'v1_fri_5', version_id: 'v1_old', day: 'Friday', startTime: '02:00', endTime: '03:00', subjectCode: 'FREE', subjectName: 'LIBRARY', type: 'Free', batch: 'ALL', room: 'Library', faculty: '-', isEligibleForB1: false },

  // SATURDAY (v1_old - ODD)
  { id: 'v1_sat_1', version_id: 'v1_old', day: 'Saturday', startTime: '09:25', endTime: '10:20', subjectCode: 'DATAENC', subjectName: 'Data Encryption (DATAENC - CR)', type: 'Theory', batch: 'ALL', room: '201', faculty: 'CR', isEligibleForB1: true },
  { id: 'v1_sat_break1', version_id: 'v1_old', day: 'Saturday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v1_sat_2', version_id: 'v1_old', day: 'Saturday', startTime: '10:30', endTime: '11:30', subjectCode: 'DATAENC', subjectName: 'Data Encryption (DATAENC - CR)', type: 'Theory', batch: 'ALL', room: '201', faculty: 'CR', isEligibleForB1: true },

  // =========================================================================
  // NEW TIMETABLE (v2_new) - EFFECTIVE 10-08-2026 ONWARD (W.E.F. 10-08-2026)
  // =========================================================================

  // MONDAY (v2_new)
  { id: 'v2_mon_1', version_id: 'v2_new', day: 'Monday', startTime: '08:30', endTime: '09:25', subjectCode: 'PDS', subjectName: 'Python for Data Science (PDS - VS)', type: 'Theory', batch: 'ALL', room: '209', faculty: 'VS', isEligibleForB1: true },
  { id: 'v2_mon_2', version_id: 'v2_new', day: 'Monday', startTime: '09:25', endTime: '10:20', subjectCode: 'SS', subjectName: 'System Software (SS - HS)', type: 'Theory', batch: 'ALL', room: '209', faculty: 'HS', isEligibleForB1: true },
  { id: 'v2_mon_break1', version_id: 'v2_new', day: 'Monday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_mon_3', version_id: 'v2_new', day: 'Monday', startTime: '10:30', endTime: '11:30', subjectCode: 'WAD', subjectName: 'Web Application Development (WAD - LK)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'LK', isEligibleForB1: true },
  { id: 'v2_mon_4', version_id: 'v2_new', day: 'Monday', startTime: '11:30', endTime: '12:30', subjectCode: 'CN', subjectName: 'Computer Networks (CN - JP)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'JP', isEligibleForB1: true },
  { id: 'v2_mon_break2', version_id: 'v2_new', day: 'Monday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'RECESS / BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_mon_5_b1', version_id: 'v2_new', day: 'Monday', startTime: '01:00', endTime: '03:00', subjectCode: 'PDS', subjectName: 'PDS Practical (B1)', type: 'Practical', batch: 'B1', room: '221B', faculty: 'VS', isEligibleForB1: true },

  // TUESDAY (v2_new)
  { id: 'v2_tue_1_b1', version_id: 'v2_new', day: 'Tuesday', startTime: '08:30', endTime: '10:20', subjectCode: 'CN', subjectName: 'CN Practical (B1)', type: 'Practical', batch: 'B1', room: '221A', faculty: 'JP', isEligibleForB1: true },
  { id: 'v2_tue_break1', version_id: 'v2_new', day: 'Tuesday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_tue_2', version_id: 'v2_new', day: 'Tuesday', startTime: '10:30', endTime: '11:30', subjectCode: 'PM', subjectName: 'Project Management (PM - SM)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'SM', isEligibleForB1: true },
  { id: 'v2_tue_3', version_id: 'v2_new', day: 'Tuesday', startTime: '11:30', endTime: '12:30', subjectCode: 'CN', subjectName: 'Computer Networks (CN - JP)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'JP', isEligibleForB1: true },
  { id: 'v2_tue_break2', version_id: 'v2_new', day: 'Tuesday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'RECESS / BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_tue_4', version_id: 'v2_new', day: 'Tuesday', startTime: '01:00', endTime: '02:00', subjectCode: 'WAD', subjectName: 'Web Application Development (WAD - LK)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'LK', isEligibleForB1: true },
  { id: 'v2_tue_5', version_id: 'v2_new', day: 'Tuesday', startTime: '02:00', endTime: '03:00', subjectCode: 'MI', subjectName: 'Microprocessor and Interfacing (MI - RJ)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'RJ', isEligibleForB1: true },

  // WEDNESDAY (v2_new)
  { id: 'v2_wed_1_b1', version_id: 'v2_new', day: 'Wednesday', startTime: '08:30', endTime: '10:20', subjectCode: 'MI', subjectName: 'MI Practical (B1)', type: 'Practical', batch: 'B1', room: '221D', faculty: 'RJ', isEligibleForB1: true },
  { id: 'v2_wed_break1', version_id: 'v2_new', day: 'Wednesday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_wed_2', version_id: 'v2_new', day: 'Wednesday', startTime: '10:30', endTime: '11:30', subjectCode: 'CN', subjectName: 'Computer Networks (CN - JP)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'JP', isEligibleForB1: true },
  { id: 'v2_wed_3', version_id: 'v2_new', day: 'Wednesday', startTime: '11:30', endTime: '12:30', subjectCode: 'SS', subjectName: 'System Software (SS - HR)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'HR', isEligibleForB1: true },
  { id: 'v2_wed_break2', version_id: 'v2_new', day: 'Wednesday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'RECESS / BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_wed_4', version_id: 'v2_new', day: 'Wednesday', startTime: '01:00', endTime: '02:00', subjectCode: 'PDS', subjectName: 'Python for Data Science (PDS - VS)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'VS', isEligibleForB1: true },
  { id: 'v2_wed_5', version_id: 'v2_new', day: 'Wednesday', startTime: '02:00', endTime: '03:00', subjectCode: 'FREE', subjectName: 'LIBRARY', type: 'Free', batch: 'ALL', room: 'Library', faculty: '-', isEligibleForB1: false },

  // THURSDAY (v2_new)
  { id: 'v2_thu_1_b1', version_id: 'v2_new', day: 'Thursday', startTime: '08:30', endTime: '10:20', subjectCode: 'SS', subjectName: 'SS Practical (B1)', type: 'Practical', batch: 'B1', room: '221D', faculty: 'HS', isEligibleForB1: true },
  { id: 'v2_thu_break1', version_id: 'v2_new', day: 'Thursday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_thu_2', version_id: 'v2_new', day: 'Thursday', startTime: '10:30', endTime: '11:30', subjectCode: 'SS', subjectName: 'System Software (SS - HR)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'HR', isEligibleForB1: true },
  { id: 'v2_thu_3', version_id: 'v2_new', day: 'Thursday', startTime: '11:30', endTime: '12:30', subjectCode: 'WAD', subjectName: 'Web Application Development (WAD - PH)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'PH', isEligibleForB1: true },
  { id: 'v2_thu_break2', version_id: 'v2_new', day: 'Thursday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'RECESS / BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_thu_4', version_id: 'v2_new', day: 'Thursday', startTime: '01:00', endTime: '02:00', subjectCode: 'MI', subjectName: 'Microprocessor and Interfacing (MI - RJ)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'RJ', isEligibleForB1: true },
  { id: 'v2_thu_5', version_id: 'v2_new', day: 'Thursday', startTime: '02:00', endTime: '03:00', subjectCode: 'FREE', subjectName: 'PM() - Free Lecture', type: 'Free', batch: 'ALL', room: '248', faculty: '-', isEligibleForB1: false, notes: 'PM() with empty brackets - Free lecture' },

  // FRIDAY (v2_new)
  { id: 'v2_fri_1', version_id: 'v2_new', day: 'Friday', startTime: '08:30', endTime: '09:25', subjectCode: 'MI', subjectName: 'Microprocessor and Interfacing (MI - RJ)', type: 'Theory', batch: 'ALL', room: '203', faculty: 'RJ', isEligibleForB1: true },
  { id: 'v2_fri_2', version_id: 'v2_new', day: 'Friday', startTime: '09:25', endTime: '10:20', subjectCode: 'PM', subjectName: 'Project Management (PM - SM)', type: 'Theory', batch: 'ALL', room: '203', faculty: 'SM', isEligibleForB1: true },
  { id: 'v2_fri_break1', version_id: 'v2_new', day: 'Friday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_fri_3_b1', version_id: 'v2_new', day: 'Friday', startTime: '10:30', endTime: '12:30', subjectCode: 'WAD', subjectName: 'WAD Practical (B1)', type: 'Practical', batch: 'B1', room: '221B', faculty: 'PH', isEligibleForB1: true },
  { id: 'v2_fri_break2', version_id: 'v2_new', day: 'Friday', startTime: '12:30', endTime: '01:00', subjectCode: 'FREE', subjectName: 'RECESS / BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_fri_4', version_id: 'v2_new', day: 'Friday', startTime: '01:00', endTime: '02:00', subjectCode: 'PDS', subjectName: 'Python for Data Science (PDS - VS)', type: 'Theory', batch: 'ALL', room: '248', faculty: 'VS', isEligibleForB1: true },
  { id: 'v2_fri_5', version_id: 'v2_new', day: 'Friday', startTime: '02:00', endTime: '03:00', subjectCode: 'FREE', subjectName: 'LIBRARY', type: 'Free', batch: 'ALL', room: 'Library', faculty: '-', isEligibleForB1: false },

  // SATURDAY (v2_new - ODD)
  { id: 'v2_sat_1', version_id: 'v2_new', day: 'Saturday', startTime: '09:25', endTime: '10:20', subjectCode: 'DATAENC', subjectName: 'Data Encryption (DATAENC - CR)', type: 'Theory', batch: 'ALL', room: '201', faculty: 'CR', isEligibleForB1: true },
  { id: 'v2_sat_break1', version_id: 'v2_new', day: 'Saturday', startTime: '10:20', endTime: '10:30', subjectCode: 'FREE', subjectName: 'BREAK', type: 'Free', batch: 'ALL', room: 'Campus', faculty: '-', isEligibleForB1: false },
  { id: 'v2_sat_2', version_id: 'v2_new', day: 'Saturday', startTime: '10:30', endTime: '11:30', subjectCode: 'DATAENC', subjectName: 'Data Encryption (DATAENC - CR)', type: 'Theory', batch: 'ALL', room: '201', faculty: 'CR', isEligibleForB1: true },
];

export const INITIAL_ATTENDANCE_RECORDS: Record<string, AttendanceRecord> = {};
