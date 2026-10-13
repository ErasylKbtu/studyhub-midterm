import { ArrowUpRight, BookOpen, Heart, Plus } from 'lucide-react';

export default function Header({ currentView, savedCount, onNavigate, onAdd }) {
  console.log('Header rendered');
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <button className="brand" type="button" onClick={() => onNavigate('discover')} aria-label="StudyHub home">
          <span className="brand-mark"><BookOpen size={23} strokeWidth={2.4} /></span>
          <span className="brand-copy"><strong>studyhub<span className="brand-dot">.</span></strong><small>your learning library</small></span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <button className={`nav-link ${currentView === 'discover' ? 'active' : ''}`} type="button" onClick={() => onNavigate('discover')}>
            Discover
          </button>
          <button className={`nav-link ${currentView === 'saved' ? 'active' : ''}`} type="button" onClick={() => onNavigate('saved')}>
            <Heart size={16} /> Saved <span className="nav-count">{savedCount}</span>
          </button>
        </nav>

        <div className="header-actions">
          <span className="header-eyebrow"><span className="online-dot" /> Demo catalog <ArrowUpRight size={13} /></span>
          <button className="button button-primary button-add" type="button" onClick={onAdd}>
            <Plus size={17} strokeWidth={2.4} /><span>Add course</span>
          </button>
        </div>
      </div>
    </header>
  );
}
