import { useEffect, useState } from 'react';
import { BookPlus, LoaderCircle, X } from 'lucide-react';
import { CATEGORIES, LEVELS } from '../lib/courseUi.js';

const INITIAL_FORM = {
  title: '', instructor: '', category: 'Development', level: 'Beginner',
  durationHours: '6', lessons: '12', description: '', outcomes: '',
};

export default function AddCourseModal({ onClose, onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEscape = (event) => { if (event.key === 'Escape' && !isSubmitting) onClose(); };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, isSubmitting]);

  function change(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await onCreate(form);
    } catch (err) {
      setError(err.message || 'Could not create the course.');
      setSubmitting(false);
    }
  }

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><div className="modal-heading"><span className="modal-icon"><BookPlus size={23}/></span><div><span className="modal-eyebrow">GROW THE LIBRARY</span><h2 id="modal-title">Add a new course</h2></div></div><button className="modal-close" type="button" aria-label="Close form" onClick={onClose} disabled={isSubmitting}><X size={20}/></button></div>
      <p className="modal-intro">Share a new learning topic. Your course will appear in this browser's catalog.</p>
      <form onSubmit={handleSubmit} className="course-form">
        <label>Course title <span className="required">*</span><input name="title" value={form.title} onChange={change} required minLength={3} maxLength={85} placeholder="e.g. Building apps with React" autoFocus/></label>
        <div className="form-grid"><label>Category <span className="required">*</span><select name="category" value={form.category} onChange={change}>{CATEGORIES.map((c)=><option key={c} value={c}>{c}</option>)}</select></label><label>Level <span className="required">*</span><select name="level" value={form.level} onChange={change}>{LEVELS.map((l)=><option key={l} value={l}>{l}</option>)}</select></label></div>
        <label>Instructor <span className="required">*</span><input name="instructor" value={form.instructor} onChange={change} required minLength={2} maxLength={55} placeholder="Instructor name"/></label>
        <div className="form-grid"><label>Duration (hours) <span className="required">*</span><input name="durationHours" type="number" min="1" max="100" step="1" value={form.durationHours} onChange={change} required/></label><label>Number of lessons <span className="required">*</span><input name="lessons" type="number" min="1" max="200" step="1" value={form.lessons} onChange={change} required/></label></div>
        <label>Description <span className="required">*</span><textarea name="description" rows={3} minLength={20} maxLength={500} value={form.description} onChange={change} required placeholder="What will students explore in this course? (at least 20 characters)"/></label>
        <label>Learning outcomes <span className="optional">optional · one per line</span><textarea name="outcomes" rows={3} value={form.outcomes} onChange={change} placeholder={'Understand the core concepts\nCreate a small practice project'} maxLength={600}/></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button type="button" className="button button-outline" onClick={onClose} disabled={isSubmitting}>Cancel</button><button type="submit" className="button button-primary" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle size={18} className="spin"/> : <BookPlus size={18}/>} {isSubmitting ? 'Adding course...' : 'Publish course'}</button></div>
      </form>
    </section>
  </div>;
}
