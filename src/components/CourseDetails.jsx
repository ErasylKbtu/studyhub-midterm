import { ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Bookmark, CalendarDays, CheckCircle2, Clock3, GraduationCap, Layers3, UserRound } from 'lucide-react';
import StatePanel from './StatePanel.jsx';
import { formatDuration, getCourseTheme } from '../lib/courseUi.js';

export default function CourseDetails({ course, status, error, isSaved, onBack, onRetry, onToggleSave }) {
  if (status === 'loading') return <div className="detail-loading" role="status"><span className="spinner" /> Loading course details...</div>;
  if (status === 'error' || !course) return <StatePanel type="error" title="Course details unavailable" description={error || 'The course could not be loaded.'} action={onRetry} actionLabel="Try again"/>;
  const { icon: Icon, tone } = getCourseTheme(course.category);
  return <section className="details-page">
    <button className="back-link" type="button" onClick={onBack}><ArrowLeft size={17}/> Back to courses</button>
    <div className="detail-layout">
      <main className="detail-main">
        <div className={`detail-cover course-art--${tone}`}>
          <div className="detail-cover-orbit orbit-a"/><div className="detail-cover-orbit orbit-b"/>
          <span className="detail-icon"><Icon size={62} strokeWidth={1.45}/></span>
          <span className="detail-cover-label">LEARNING STARTS HERE / STUDYHUB</span>
        </div>
        <div className="detail-heading"><div className="course-topline"><span>{course.category}</span><span className="topline-dot"/><span>{course.level}</span></div><h1>{course.title}</h1><p>{course.description}</p></div>
        <div className="detail-section"><div className="section-kicker"><BadgeCheck size={17}/> COURSE OVERVIEW</div><h2>What you'll learn</h2><div className="outcome-list">{course.outcomes.map((outcome, index)=><div className="outcome" key={`${index}-${outcome}`}><CheckCircle2 size={19}/><span>{outcome}</span></div>)}</div></div>
        <div className="detail-section about-course"><div className="section-kicker"><Layers3 size={17}/> LEARNING PATH</div><h2>Built for your next step</h2><p>Designed as a focused learning experience, this course brings together clear explanations, real examples, and bite-sized lessons. Take it one topic at a time and practice along the way.</p><div className="learning-points"><span><BookOpen size={17}/> Practical lessons</span><span><GraduationCap size={17}/> Self-paced study</span><span><BadgeCheck size={17}/> Learning outcomes</span></div></div>
      </main>
      <aside className="detail-sidebar"><div className="detail-sticky"><div className="enroll-card"><div className="enroll-card-top"><span className="enroll-free">OPEN LEARNING</span><span className="enroll-price">Free</span></div><p>Save this course to keep it in your personal library and come back anytime.</p><button className={`button ${isSaved ? 'button-outline' : 'button-primary'} save-detail`} type="button" onClick={() => onToggleSave(course.id)}><Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'}/>{isSaved ? 'Saved to library' : 'Save this course'}<ArrowRight size={17}/></button><div className="detail-divider"/><h3>This course includes</h3><div className="detail-specs"><span><Clock3 size={18}/> Duration <strong>{formatDuration(course.durationHours)}</strong></span><span><BookOpen size={18}/> Lessons <strong>{course.lessons}</strong></span><span><GraduationCap size={18}/> Level <strong>{course.level}</strong></span><span><UserRound size={18}/> Instructor <strong>{course.instructor}</strong></span><span><CalendarDays size={18}/> Added <strong>{new Date(`${course.publishedAt}T12:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</strong></span></div></div><p className="side-note">StudyHub uses a simulated course API. All catalog edits are stored in your browser.</p></div></aside>
    </div>
  </section>;
}
