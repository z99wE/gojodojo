// Content index: grade data, board text, and grade/progress helpers.
import grade1 from './grade-1.js';
import grade2 from './grade-2.js';
import grade3 from './grade-3.js';
import grade4 from './grade-4.js';
import grade5 from './grade-5.js';
import grade6 from './grade-6.js';
import grade7 from './grade-7.js';
import grade8 from './grade-8.js';
import { BOARD } from './board.js';

export { BOARD };

export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8];

const GRADE_KEY = 'ss-grade';
const DEFAULT_GRADE = 8;

const GRADE_FILES = {
  1: grade1,
  2: grade2,
  3: grade3,
  4: grade4,
  5: grade5,
  6: grade6,
  7: grade7,
  8: grade8,
};

// Topic ids in display order for each grade.
const TOPIC_IDS = [
  'maths-1', 'maths-2', 'maths-3', 'maths-4',
  'science-1', 'science-2', 'science-3', 'science-4',
];

// Return the saved grade (1..8), or the default when missing or invalid.
export function getGrade() {
  try {
    const n = parseInt(localStorage.getItem(GRADE_KEY), 10);
    return GRADES.includes(n) ? n : DEFAULT_GRADE;
  } catch {
    return DEFAULT_GRADE;
  }
}

// Save a grade if it is an integer 1..8. Returns the grade now in effect.
export function setGrade(n) {
  if (!Number.isInteger(n) || n < 1 || n > 8) return getGrade();
  try {
    localStorage.setItem(GRADE_KEY, String(n));
  } catch {
    // Storage unavailable: the grade still applies for this session.
  }
  return n;
}

// Look up one topic. The hub board is handled separately, so 'hub-1' returns null.
export function getTopic(stoneId, grade = getGrade()) {
  if (stoneId === 'hub-1') return null;
  const file = GRADE_FILES[grade];
  return file?.topics?.[stoneId] ?? null;
}

// List { id, subject, title } for every topic in a grade, in display order.
export function topicsForGrade(grade = getGrade()) {
  const file = GRADE_FILES[grade];
  if (!file) return [];
  return TOPIC_IDS
    .filter((id) => file.topics?.[id])
    .map((id) => ({
      id,
      subject: file.topics[id].subject,
      title: file.topics[id].title,
    }));
}

// Key used to store progress for one stone in one grade.
export function progressKey(stoneId, grade = getGrade()) {
  return 'g' + grade + ':' + stoneId;
}
