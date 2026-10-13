import CourseCard from './CourseCard.jsx';
import StatePanel from './StatePanel.jsx';

export default function CourseGrid({ status, error, courses, view, onOpen, savedIds, onToggleSave, onRetry, onClearFilters, hasFilters, onDiscover }) {
  if (status === 'loading') {
    return <div className="course-grid" role="status" aria-label="Loading courses">
      {Array.from({ length: 9 }, (_, index) => <div className="course-card skeleton-card" key={index}><div className="skeleton-art shimmer"/><div className="skeleton-body"><div className="skeleton-line short shimmer"/><div className="skeleton-line title shimmer"/><div className="skeleton-line shimmer"/><div className="skeleton-line shimmer"/><div className="skeleton-line mid shimmer"/></div></div>)}
    </div>;
  }

  if (status === 'error') {
    return <StatePanel type="error" title="We couldn't load the courses" description={error || 'Something went wrong. Please try again.'} action={onRetry} actionLabel="Try again"/>;
  }

  if (!courses.length) {
    if (view === 'saved' && !hasFilters) {
      return <StatePanel type="saved" title="Your saved list is waiting" description="Bookmark courses that spark your interest and find them all here." action={onDiscover} actionLabel="Explore courses"/>;
    }
    return <StatePanel title="No matching courses" description="Try a different keyword or remove some filters. There is plenty more to discover." action={onClearFilters} actionLabel="Clear filters"/>;
  }

  return <div className="course-grid">{courses.map((course) => <CourseCard key={course.id} course={course} isSaved={savedIds.includes(course.id)} onOpen={onOpen} onToggleSave={onToggleSave}/>)}</div>;
}
