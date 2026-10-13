import { ArrowUpRight, BookOpen, Bookmark, Clock3 } from 'lucide-react';
import { formatDuration, getCourseTheme } from '../lib/courseUi.js';

export default function CourseCard({ course, isSaved, onOpen, onToggleSave }) {
  console.log('CourseCard rendered:', course.title);
  const { icon: Icon, tone } = getCourseTheme(course.category);
  return (
    <article className="course-card">
      <div className={`course-art course-art--${tone}`}>
        <div className="course-art-circle circle-one" /><div className="course-art-circle circle-two" />
        <div className="art-stamp"><Icon size={35} strokeWidth={1.65} /></div>
        <span className="art-label">STUDY / {course.category.toUpperCase()}</span>
        <button
          className={`save-button ${isSaved ? 'is-saved' : ''}`}
          type="button"
          title={isSaved ? 'Remove from saved' : 'Save this course'}
          aria-label={isSaved ? `Unsave ${course.title}` : `Save ${course.title}`}
          aria-pressed={isSaved}
          onClick={() => onToggleSave(course.id)}
        ><Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="course-content">
        <div className="course-topline"><span>{course.category}</span><span className="topline-dot" /> <span>{course.level}</span></div>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta"><span><Clock3 size={15} /> {formatDuration(course.durationHours)}</span><span><BookOpen size={15} /> {course.lessons} lessons</span></div>
        <div className="course-bottom"><span className="instructor"><span className="instructor-avatar">{course.instructor.split(' ').map((part) => part[0]).slice(0,2).join('')}</span><span>{course.instructor}</span></span><button className="course-open" onClick={() => onOpen(course.id)} type="button" aria-label={`View details for ${course.title}`}><ArrowUpRight size={21} /></button></div>
      </div>
    </article>
  );
}
