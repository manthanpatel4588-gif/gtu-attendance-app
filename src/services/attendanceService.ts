import { 
  TimetableVersion, 
  TimetableEntry, 
  AttendanceRecord, 
  SubjectStats, 
  DaySummary, 
  TestResult, 
  StudentBatch,
  AttendanceCategoryStats,
  JulyBaseline
} from '../types';
import { SUBJECTS } from '../data/defaultData';

/**
 * Given an ISO date string (YYYY-MM-DD), find the active timetable version.
 */
export function getActiveTimetableVersion(dateStr: string, versions: TimetableVersion[]): TimetableVersion {
  if (!dateStr || !versions || versions.length === 0) {
    throw new Error('Invalid date or versions provided');
  }

  const sorted = [...versions].sort((a, b) => b.effective_from.localeCompare(a.effective_from));

  for (const v of sorted) {
    const from = v.effective_from;
    const to = v.effective_to || '9999-12-31';

    if (dateStr >= from && dateStr <= to) {
      return v;
    }
  }

  return versions[0];
}

/**
 * Returns Day of Week string from ISO Date (YYYY-MM-DD).
 */
export function getDayOfWeek(dateStr: string): 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' {
  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const d = new Date(`${dateStr}T12:00:00`);
  return days[d.getDay()];
}

/**
 * Format ISO date string into readable format (e.g. "03 Aug 2026")
 */
export function formatDateReadable(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * Get timetable entries applicable for selected date and student batch.
 */
export function getTimetableEntriesForDate(
  dateStr: string,
  batch: StudentBatch,
  versions: TimetableVersion[],
  allEntries: TimetableEntry[]
): { version: TimetableVersion; dayName: string; entries: TimetableEntry[] } {
  const version = getActiveTimetableVersion(dateStr, versions);
  const dayName = getDayOfWeek(dateStr);

  const entries = allEntries.filter(entry => {
    if (entry.version_id !== version.id || entry.day !== dayName) {
      return false;
    }
    if (entry.batch !== 'ALL' && entry.batch !== batch) {
      return false;
    }
    return true;
  });

  return { version, dayName, entries };
}

/**
 * Mathematically precise 75% attendance target calculator.
 */
export function calculate75PercentTarget(present: number, conducted: number): { neededFor75: number; canMissFor75: number } {
  if (conducted === 0) {
    return { neededFor75: 0, canMissFor75: 0 };
  }

  const rate = present / conducted;

  if (rate < 0.75) {
    const needed = Math.max(0, Math.ceil(3 * conducted - 4 * present));
    return { neededFor75: needed, canMissFor75: 0 };
  } else {
    const canMiss = Math.max(0, Math.floor((4 * present - 3 * conducted) / 3));
    return { neededFor75: 0, canMissFor75: canMiss };
  }
}

/**
 * Helper to build AttendanceCategoryStats
 */
function buildCategoryStats(conducted: number, present: number, absent: number): AttendanceCategoryStats {
  const percentage = conducted > 0 ? (present / conducted) * 100 : 0;
  const targets = calculate75PercentTarget(present, conducted);
  return {
    conducted,
    present,
    absent,
    percentage: Math.round(percentage * 100) / 100,
    ...targets,
  };
}

/**
 * Calculate overall attendance statistics including July baseline if enabled.
 */
export function calculateOverallStats(
  attendanceRecords: Record<string, AttendanceRecord>,
  versions: TimetableVersion[],
  allEntries: TimetableEntry[],
  julyBaseline?: JulyBaseline
) {
  const entryMap = new Map(allEntries.map(e => [e.id, e]));

  let theoryConducted = 0, theoryPresent = 0, theoryAbsent = 0;
  let labConducted = 0, labPresent = 0, labAbsent = 0;

  Object.values(attendanceRecords).forEach(rec => {
    const entry = entryMap.get(rec.timetable_entry_id);
    if (!entry) return;

    if (entry.subjectCode === 'FREE' || entry.type === 'Free' || !entry.isEligibleForB1) {
      return;
    }

    const isLab = entry.type === 'Practical' || entry.type === 'Tutorial';

    if (isLab) {
      labConducted++;
      if (rec.status === 'PRESENT') labPresent++;
      else if (rec.status === 'ABSENT') labAbsent++;
    } else {
      theoryConducted++;
      if (rec.status === 'PRESENT') theoryPresent++;
      else if (rec.status === 'ABSENT') theoryAbsent++;
    }
  });

  // Include July Baseline if enabled
  const baseConducted = julyBaseline?.enabled ? julyBaseline.conducted : 0;
  const basePresent = julyBaseline?.enabled ? julyBaseline.present : 0;
  const baseAbsent = julyBaseline?.enabled ? julyBaseline.absent : 0;

  const totalConducted = theoryConducted + labConducted + baseConducted;
  const totalPresent = theoryPresent + labPresent + basePresent;
  const totalAbsent = theoryAbsent + labAbsent + baseAbsent;

  return {
    theory: buildCategoryStats(theoryConducted, theoryPresent, theoryAbsent),
    lab: buildCategoryStats(labConducted, labPresent, labAbsent),
    combined: buildCategoryStats(totalConducted, totalPresent, totalAbsent),
    julyBaseline: julyBaseline?.enabled ? julyBaseline : null,
  };
}

/**
 * Target Goal Planner: Calculate requirements to hit target % (e.g. 70%) by 01/09/2026.
 */
export function calculateTargetGoalPlanner(
  julyBaseline: JulyBaseline,
  attendanceRecords: Record<string, AttendanceRecord>,
  versions: TimetableVersion[],
  allEntries: TimetableEntry[],
  targetPercent: number = 70
) {
  const currentOverall = calculateOverallStats(attendanceRecords, versions, allEntries, julyBaseline);

  // Total estimated lectures in August (~94 lectures for GTU V-B)
  const totalAugustLecturesEstimated = 94;
  const currentAugustConducted = currentOverall.combined.conducted - (julyBaseline.enabled ? julyBaseline.conducted : 0);
  const currentAugustPresent = currentOverall.combined.present - (julyBaseline.enabled ? julyBaseline.present : 0);
  const currentAugustAbsent = currentOverall.combined.absent - (julyBaseline.enabled ? julyBaseline.absent : 0);

  const totalProjectedConducted = (julyBaseline.enabled ? julyBaseline.conducted : 0) + totalAugustLecturesEstimated;
  const totalPresentNeededForTarget = Math.ceil((targetPercent / 100) * totalProjectedConducted);

  const augustPresentNeeded = Math.max(0, totalPresentNeededForTarget - (julyBaseline.enabled ? julyBaseline.present : 0));
  const augustMaxCanMiss = Math.max(0, totalAugustLecturesEstimated - augustPresentNeeded);
  const augustTargetRate = totalAugustLecturesEstimated > 0 ? (augustPresentNeeded / totalAugustLecturesEstimated) * 100 : 0;

  return {
    julyPercent: julyBaseline.percentage,
    julyConducted: julyBaseline.conducted,
    julyPresent: julyBaseline.present,
    targetPercent,
    totalProjectedConducted,
    totalPresentNeededForTarget,
    totalAugustLecturesEstimated,
    currentAugustConducted,
    currentAugustPresent,
    currentAugustAbsent,
    augustPresentNeeded,
    augustMaxCanMiss,
    augustTargetRate: Math.round(augustTargetRate * 10) / 10,
  };
}

/**
 * Calculate subject-wise attendance statistics.
 */
export function calculateSubjectStats(
  attendanceRecords: Record<string, AttendanceRecord>,
  versions: TimetableVersion[],
  allEntries: TimetableEntry[]
): SubjectStats[] {
  const entryMap = new Map(allEntries.map(e => [e.id, e]));

  const statsMap: Record<string, {
    theoryConducted: number; theoryPresent: number; theoryAbsent: number;
    labConducted: number; labPresent: number; labAbsent: number;
  }> = {};

  Object.keys(SUBJECTS).forEach(code => {
    if (code !== 'FREE') {
      statsMap[code] = {
        theoryConducted: 0, theoryPresent: 0, theoryAbsent: 0,
        labConducted: 0, labPresent: 0, labAbsent: 0,
      };
    }
  });

  Object.values(attendanceRecords).forEach(rec => {
    const entry = entryMap.get(rec.timetable_entry_id);
    if (!entry) return;

    if (entry.subjectCode === 'FREE' || entry.type === 'Free' || !entry.isEligibleForB1) {
      return;
    }

    const code = entry.subjectCode;
    if (!statsMap[code]) {
      statsMap[code] = {
        theoryConducted: 0, theoryPresent: 0, theoryAbsent: 0,
        labConducted: 0, labPresent: 0, labAbsent: 0,
      };
    }

    const isLab = entry.type === 'Practical' || entry.type === 'Tutorial';

    if (isLab) {
      statsMap[code].labConducted++;
      if (rec.status === 'PRESENT') statsMap[code].labPresent++;
      else if (rec.status === 'ABSENT') statsMap[code].labAbsent++;
    } else {
      statsMap[code].theoryConducted++;
      if (rec.status === 'PRESENT') statsMap[code].theoryPresent++;
      else if (rec.status === 'ABSENT') statsMap[code].theoryAbsent++;
    }
  });

  return Object.entries(statsMap).map(([code, s]) => {
    const subjectInfo = SUBJECTS[code] || { name: code };
    
    const theory = buildCategoryStats(s.theoryConducted, s.theoryPresent, s.theoryAbsent);
    const lab = buildCategoryStats(s.labConducted, s.labPresent, s.labAbsent);

    const totalConducted = s.theoryConducted + s.labConducted;
    const totalPresent = s.theoryPresent + s.labPresent;
    const totalAbsent = s.theoryAbsent + s.labAbsent;
    const combined = buildCategoryStats(totalConducted, totalPresent, totalAbsent);

    return {
      code: code as any,
      name: subjectInfo.name,
      theory,
      lab,
      combined,
    };
  });
}

/**
 * Calculate weekly day summary (Monday to Saturday) for a given date's week.
 */
export function getWeeklySummary(
  targetDateStr: string,
  attendanceRecords: Record<string, AttendanceRecord>,
  versions: TimetableVersion[],
  allEntries: TimetableEntry[]
): DaySummary[] {
  const d = new Date(`${targetDateStr}T12:00:00`);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);

  const daysList: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const entryMap = new Map(allEntries.map(e => [e.id, e]));

  return daysList.map((dayName, index) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + index);
    const dateStr = current.toISOString().split('T')[0];

    let theoryConducted = 0, theoryPresent = 0, theoryAbsent = 0;
    let labConducted = 0, labPresent = 0, labAbsent = 0;

    Object.values(attendanceRecords).forEach(rec => {
      if (rec.date === dateStr) {
        const entry = entryMap.get(rec.timetable_entry_id);
        if (entry && entry.subjectCode !== 'FREE' && entry.type !== 'Free' && entry.isEligibleForB1) {
          const isLab = entry.type === 'Practical' || entry.type === 'Tutorial';
          if (isLab) {
            labConducted++;
            if (rec.status === 'PRESENT') labPresent++;
            else if (rec.status === 'ABSENT') labAbsent++;
          } else {
            theoryConducted++;
            if (rec.status === 'PRESENT') theoryPresent++;
            else if (rec.status === 'ABSENT') theoryAbsent++;
          }
        }
      }
    });

    const totalConducted = theoryConducted + labConducted;
    const totalPresent = theoryPresent + labPresent;
    const totalAbsent = theoryAbsent + labAbsent;
    const percentage = totalConducted > 0 ? (totalPresent / totalConducted) * 100 : 0;

    return {
      dayName,
      dateStr,
      theoryConducted,
      theoryPresent,
      theoryAbsent,
      labConducted,
      labPresent,
      labAbsent,
      totalConducted,
      totalPresent,
      totalAbsent,
      percentage: Math.round(percentage * 100) / 100,
    };
  });
}

/**
 * Automated Verification Test Suite enforcing TEST 1 through TEST 5 from user requirements.
 */
export function runAutomatedTestSuite(versions: TimetableVersion[]): TestResult[] {
  const testCases = [
    { testId: 'TEST-1', title: 'Select 03-08-2026', date: '2026-08-03', expectedDay: 'Monday', expectedVersionId: 'v1_old', expectedVersionName: 'OLD TIMETABLE' },
    { testId: 'TEST-2', title: 'Select 05-08-2026', date: '2026-08-05', expectedDay: 'Wednesday', expectedVersionId: 'v1_old', expectedVersionName: 'OLD TIMETABLE' },
    { testId: 'TEST-3', title: 'Select 09-08-2026', date: '2026-08-09', expectedDay: 'Sunday', expectedVersionId: 'v1_old', expectedVersionName: 'OLD TIMETABLE' },
    { testId: 'TEST-4', title: 'Select 10-08-2026', date: '2026-08-10', expectedDay: 'Monday', expectedVersionId: 'v2_new', expectedVersionName: 'NEW TIMETABLE' },
    { testId: 'TEST-5', title: 'Select 11-08-2026', date: '2026-08-11', expectedDay: 'Tuesday', expectedVersionId: 'v2_new', expectedVersionName: 'NEW TIMETABLE' },
  ];

  return testCases.map(tc => {
    const activeVer = getActiveTimetableVersion(tc.date, versions);
    const actualDay = getDayOfWeek(tc.date);
    const passed = activeVer.id === tc.expectedVersionId && actualDay === tc.expectedDay;

    return {
      testId: tc.testId,
      title: tc.title,
      date: tc.date,
      expectedDay: tc.expectedDay,
      expectedVersionId: tc.expectedVersionId,
      expectedVersionName: tc.expectedVersionName,
      actualDay,
      actualVersionId: activeVer.id,
      actualVersionName: activeVer.name,
      passed,
      notes: passed ? `Mapped ${tc.date} (${actualDay}) -> ${activeVer.name}` : `Failed: Expected ${tc.expectedVersionName}`,
    };
  });
}
