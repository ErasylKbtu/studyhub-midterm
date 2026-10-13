import { useEffect, useRef, useState } from 'react';
import { ArrowDown, BookOpen, Heart, LibraryBig, Sparkles } from 'lucide-react';
import { createCourse, getCatalogOverview, getCourseById, getCourses } from './api/coursesApi.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Filters from './components/Filters.jsx';
import CourseGrid from './components/CourseGrid.jsx';
import CourseDetails from './components/CourseDetails.jsx';
import Pagination from './components/Pagination.jsx';
import AddCourseModal from './components/AddCourseModal.jsx';
import Toast from './components/Toast.jsx';
import Footer from './components/Footer.jsx';

const PAGE_SIZE = 9;
const SAVED_KEY = 'studyhub-saved-v1';
const EMPTY_RESULT = { items: [], total: 0, page: 1, pages: 1 };

function getSavedFromStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function urlCourseId() {
  return new URLSearchParams(window.location.search).get('course');
}

export default function App() {
  console.log('App rendered');
  const [view, setView] = useState('discover');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [savedIds, setSavedIds] = useState(getSavedFromStorage);
  const [courses, setCourses] = useState(EMPTY_RESULT);
  const [listStatus, setListStatus] = useState('loading');
  const [listError, setListError] = useState('');
  const [reloadToken, setReloadToken] = useState(0);
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [courseId, setCourseId] = useState(urlCourseId);
  const [detail, setDetail] = useState(null);
  const [detailStatus, setDetailStatus] = useState('idle');
  const [detailError, setDetailError] = useState('');
  const [detailReloadToken, setDetailReloadToken] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState('');
  const catalogRef = useRef(null);
  const openedDetailInApp = useRef(false);

  // Keep favorite IDs between browser sessions; the catalog itself is saved by the simulated API.
  useEffect(() => {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(savedIds)); } catch { /* Favorites stay in memory */ }
  }, [savedIds]);

  // Debounce input so a request isn't started for every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  // React to browser Back / Forward buttons when showing course details.
  useEffect(() => {
    const syncFromHistory = () => {
      setCourseId(urlCourseId());
      openedDetailInApp.current = false;
    };
    window.addEventListener('popstate', syncFromHistory);
    return () => window.removeEventListener('popstate', syncFromHistory);
  }, []);

  // Asynchronous catalog request. Abort prevents old responses from overwriting a new query.
  useEffect(() => {
    const controller = new AbortController();
    setListStatus('loading');
    setListError('');
    getCourses({
      search: debouncedSearch, category, level, sort, page, pageSize: PAGE_SIZE,
      savedOnly: view === 'saved', savedIds,
    }, { signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setCourses(result);
        setListStatus('success');
        if (result.page !== page) setPage(result.page);
      })
      .catch((error) => {
        if (controller.signal.aborted || error.name === 'AbortError') return;
        setListError(error.message || 'An unknown error occurred.');
        setListStatus('error');
      });
    return () => controller.abort();
  }, [debouncedSearch, category, level, sort, page, view, savedIds, reloadToken]);

  // The hero uses a separate summary from the SAME catalog API.
  useEffect(() => {
    const controller = new AbortController();
    setOverviewLoading(true);
    getCatalogOverview({ signal: controller.signal })
      .then((result) => { if (!controller.signal.aborted) setOverview(result); })
      .catch((error) => { if (!controller.signal.aborted) console.error('Catalog overview:', error); })
      .finally(() => { if (!controller.signal.aborted) setOverviewLoading(false); });
    return () => controller.abort();
  }, [reloadToken]);

  // Details are fetched by ID, not taken from the list's current page.
  useEffect(() => {
    if (!courseId) {
      setDetail(null);
      setDetailStatus('idle');
      return undefined;
    }
    const controller = new AbortController();
    setDetail(null);
    setDetailStatus('loading');
    setDetailError('');
    getCourseById(courseId, { signal: controller.signal })
      .then((course) => { if (!controller.signal.aborted) { setDetail(course); setDetailStatus('success'); } })
      .catch((error) => {
        if (controller.signal.aborted || error.name === 'AbortError') return;
        setDetailError(error.message || 'The course could not be loaded.');
        setDetailStatus('error');
      });
    return () => controller.abort();
  }, [courseId, detailReloadToken]);

  // Success notification goes away automatically; timer is cleaned up on updates/unmount.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 3800);
    return () => clearTimeout(timer);
  }, [toast]);

  function resetFilters() {
    setSearch(''); setDebouncedSearch(''); setCategory('All'); setLevel('All'); setPage(1);
  }

  function navigateTo(viewName) {
    setView(viewName);
    setPage(1);
    if (courseId) {
      window.history.replaceState({}, '', window.location.pathname);
      setCourseId(null);
    }
  }

  function openCourse(id) {
    const url = new URL(window.location.href);
    url.searchParams.set('course', id);
    window.history.pushState({ studyhubCourse: true }, '', url);
    openedDetailInApp.current = true;
    setCourseId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToCourses() {
    if (openedDetailInApp.current && window.history.state?.studyhubCourse) {
      window.history.back();
    } else {
      window.history.replaceState({}, '', window.location.pathname);
      setCourseId(null);
    }
  }

  function toggleSaved(id) {
    const wasSaved = savedIds.includes(id);
    setSavedIds((previous) => wasSaved ? previous.filter((item) => item !== id) : [...previous, id]);
    setToast(wasSaved ? 'Removed from saved courses' : 'Added to your saved courses');
  }

  async function handleCreate(form) {
    const result = await createCourse(form);
    setShowAddForm(false);
    setView('discover');
    setSearch('');
    setDebouncedSearch('');
    setCategory('All');
    setLevel('All');
    setSort('newest');
    setPage(1);
    setReloadToken((previous) => previous + 1);
    if (courseId) {
      window.history.replaceState({}, '', window.location.pathname);
      setCourseId(null);
    }
    setToast(`“${result.title}” added successfully`);
  }

  const hasFilters = Boolean(search.trim()) || category !== 'All' || level !== 'All';
  const isSavedView = view === 'saved';

  return <div className="app-shell">
    <Header currentView={view} savedCount={savedIds.length} onNavigate={navigateTo} onAdd={() => setShowAddForm(true)} />
    <div className="shell page-content">
      {courseId ? <CourseDetails
        course={detail} status={detailStatus} error={detailError}
        isSaved={savedIds.includes(courseId)}
        onBack={backToCourses}
        onRetry={() => setDetailReloadToken((n) => n + 1)}
        onToggleSave={toggleSaved}
      /> : <>
        {!isSavedView && <Hero overview={overview} overviewLoading={overviewLoading} onExplore={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />}
        {isSavedView && <div className="saved-banner"><div className="saved-banner-icon"><Heart size={27}/></div><div><div className="section-eyebrow">YOUR PERSONAL COLLECTION</div><h1>A space for what inspires you.</h1><p>All the courses you have saved, ready whenever you are.</p></div></div>}
        <section className="catalog-section" id="course-catalog" ref={catalogRef} aria-labelledby="catalog-title">
          <div className="section-header"><div><div className="section-eyebrow"><Sparkles size={14}/> {isSavedView ? 'KEEP YOUR MOMENTUM' : 'CURATED FOR THE CURIOUS'}</div><h2 id="catalog-title">{isSavedView ? 'Saved courses' : 'Explore courses'} <span className="title-spark">✳</span></h2><p>{isSavedView ? 'Your personal shortlist of things worth learning.' : 'Pick a topic, find your flow, and start something new.'}</p></div><div className="result-count"><span className="result-count-icon">{isSavedView ? <Heart size={16}/> : <LibraryBig size={16}/>}</span>{listStatus === 'success' ? `${courses.total} ${courses.total === 1 ? 'course' : 'courses'}` : 'Browsing library'}</div></div>
          <Filters search={search} category={category} level={level} sort={sort}
            onSearch={(value) => { setSearch(value); setPage(1); }}
            onCategory={(value) => { setCategory(value); setPage(1); }}
            onLevel={(value) => { setLevel(value); setPage(1); }}
            onSort={(value) => { setSort(value); setPage(1); }}
            onReset={resetFilters}
          />
          <div className="results-label" aria-live="polite"><span>{listStatus === 'success' ? (courses.total ? `Showing ${(courses.page - 1) * PAGE_SIZE + 1}–${Math.min(courses.page * PAGE_SIZE, courses.total)} of ${courses.total} courses` : 'No courses to show') : listStatus === 'loading' ? 'Finding great courses...' : 'Catalog temporarily unavailable'}</span><span className="results-hint"><ArrowDown size={13} /> Updated as you filter</span></div>
          <CourseGrid status={listStatus} error={listError} courses={courses.items} view={view}
            onOpen={openCourse} savedIds={savedIds} onToggleSave={toggleSaved}
            onRetry={() => setReloadToken((n) => n + 1)}
            onClearFilters={resetFilters} hasFilters={hasFilters}
            onDiscover={() => navigateTo('discover')}
          />
          {listStatus === 'success' && <Pagination currentPage={courses.page} totalPages={courses.pages} onPageChange={(value) => { setPage(value); catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }} />}
        </section>
        {!isSavedView && <div className="bottom-banner"><div className="bottom-banner-mark"><BookOpen size={26}/></div><div><h3>Every expert was once a beginner.</h3><p>Find something you love learning, and keep showing up for it.</p></div><button type="button" onClick={() => setShowAddForm(true)}>Share a course <ArrowDown size={17}/></button></div>}
      </>}
    </div>
    <Footer />
    {showAddForm && <AddCourseModal onClose={() => setShowAddForm(false)} onCreate={handleCreate} />}
    <Toast message={toast} onDismiss={() => setToast('')} />
  </div>;
}
