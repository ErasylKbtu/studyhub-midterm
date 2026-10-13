import { ArrowRight, BookOpenCheck, GraduationCap, Layers3, Sparkles } from 'lucide-react';

export default function Hero({ overview, overviewLoading, onExplore }) {
  const count = overviewLoading ? '—' : (overview?.total ?? '—');
  const categories = overviewLoading ? '—' : (overview?.categories ?? '—');
  const lessons = overviewLoading ? '—' : (overview?.lessons?.toLocaleString('en-US') ?? '—');

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-eyebrow"><Sparkles size={15} /> A better way to keep learning</div>
        <h1 id="hero-title">A little progress.<br /><em>Every single day.</em></h1>
        <p>Explore practical courses, follow your curiosity, and make room for a skill worth building.</p>
        <button className="hero-link" type="button" onClick={onExplore}>
          Explore the library <span><ArrowRight size={18} /></span>
        </button>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-orbit orbit-outer" />
        <div className="hero-orbit orbit-inner" />
        <div className="hero-center"><BookOpenCheck size={58} strokeWidth={1.35} /></div>
        <div className="float-icon float-icon-one"><Layers3 size={27} /></div>
        <div className="float-icon float-icon-two"><GraduationCap size={32} /></div>
        <div className="float-spark">✳</div>
        <div className="hero-card hero-card-top"><span className="hero-card-bullet" /> Your next chapter starts here</div>
        <div className="hero-card hero-card-bottom"><span className="hero-card-bullet purple" /> Learn at your own pace</div>
      </div>
      <div className="hero-metrics" aria-label="Catalog statistics">
        <div className="metric"><span>{count}</span><small>courses to explore</small></div>
        <div className="metric"><span>{categories}</span><small>learning categories</small></div>
        <div className="metric"><span>{lessons}</span><small>short lessons</small></div>
      </div>
    </section>
  );
}
