import initialCourses from '../data/courses.json';
import { CATEGORIES, LEVELS } from '../lib/courseUi.js';

// The app has ONE simulated asynchronous data source, backed by localStorage.
// Initial data has 120 records. Promise delays imitate a network request.
const STORAGE_KEY = 'studyhub-catalog-v1';
const DELAY_MS = 360;

function abortError() {
  return new DOMException('The request was cancelled.', 'AbortError');
}

function waitForApi(signal, ms = DELAY_MS) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    let timer;
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
      reject(abortError());
    };

    timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

// JSON round trip simulates serializing data returned from an API.
function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function readDatabase() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCourses));
      return cloneData(initialCourses);
    }
  } catch {
    throw new Error('Browser storage is unavailable. Enable localStorage and retry.');
  }

  try {
    const records = JSON.parse(raw);
    if (!Array.isArray(records) || records.length < 1) {
      throw new Error('Invalid catalog data');
    }
    return records;
  } catch {
    throw new Error('The local course database is invalid. Clear this site’s storage and retry.');
  }
}

function saveDatabase(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    throw new Error('Could not save the course. Check browser storage settings.');
  }
}

function normalized(value) {
  return String(value ?? '').toLocaleLowerCase().trim();
}

export async function getCourses({
  search = '',
  category = 'All',
  level = 'All',
  sort = 'featured',
  page = 1,
  pageSize = 9,
  savedOnly = false,
  savedIds = [],
} = {}, { signal } = {}) {
  await waitForApi(signal);
  if (signal?.aborted) throw abortError();
  const all = readDatabase();
  const needle = normalized(search);
  const savedSet = new Set(savedIds);

  const matching = all.filter((course) => {
    const matchesSearch = !needle || [course.title, course.description, course.instructor, course.category]
      .some((field) => normalized(field).includes(needle));
    return matchesSearch
      && (category === 'All' || course.category === category)
      && (level === 'All' || course.level === level)
      && (!savedOnly || savedSet.has(course.id));
  });

  const sorters = {
    featured: (a, b) => a.id.localeCompare(b.id),
    newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id),
    'title-asc': (a, b) => a.title.localeCompare(b.title),
    'duration-asc': (a, b) => a.durationHours - b.durationHours || a.title.localeCompare(b.title),
    'duration-desc': (a, b) => b.durationHours - a.durationHours || a.title.localeCompare(b.title),
  };
  matching.sort(sorters[sort] ?? sorters.featured);
  const total = matching.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(Number(page) || 1, pages));
  const start = (safePage - 1) * pageSize;

  return cloneData({
    items: matching.slice(start, start + pageSize),
    total,
    page: safePage,
    pages,
  });
}

export async function getCatalogOverview({ signal } = {}) {
  await waitForApi(signal, 220);
  if (signal?.aborted) throw abortError();
  const records = readDatabase();
  return {
    total: records.length,
    categories: new Set(records.map((item) => item.category)).size,
    lessons: records.reduce((sum, item) => sum + item.lessons, 0),
  };
}

export async function getCourseById(id, { signal } = {}) {
  await waitForApi(signal, 280);
  if (signal?.aborted) throw abortError();
  const course = readDatabase().find((item) => item.id === id);
  if (!course) throw new Error('This course could not be found. It may have been removed.');
  return cloneData(course);
}

export async function createCourse(form, { signal } = {}) {
  await waitForApi(signal, 420);
  if (signal?.aborted) throw abortError();
  const title = String(form.title ?? '').trim();
  const description = String(form.description ?? '').trim();
  const instructor = String(form.instructor ?? '').trim();
  const durationHours = Number(form.durationHours);
  const lessons = Number(form.lessons);
  if (title.length < 3 || description.length < 20 || instructor.length < 2) {
    throw new Error('Please complete the title, instructor, and description fields.');
  }
  if (!CATEGORIES.includes(form.category) || !LEVELS.includes(form.level)) {
    throw new Error('Please select a valid category and level.');
  }
  if (!Number.isInteger(durationHours) || durationHours < 1 || durationHours > 100 ||
      !Number.isInteger(lessons) || lessons < 1 || lessons > 200) {
    throw new Error('Duration and lessons must be valid whole numbers.');
  }
  const database = readDatabase();
  const newCourse = {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    description,
    instructor,
    category: form.category,
    level: form.level,
    durationHours,
    lessons,
    publishedAt: new Date().toISOString().slice(0, 10),
    outcomes: String(form.outcomes ?? '').split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 5),
  };
  if (newCourse.outcomes.length === 0) {
    newCourse.outcomes = [
      `Understand the essentials of ${title.toLocaleLowerCase()}.`,
      'Apply the key concepts in a guided exercise.',
      'Plan a small project using what you learned.',
    ];
  }
  saveDatabase([newCourse, ...database]);
  return cloneData(newCourse);
}
