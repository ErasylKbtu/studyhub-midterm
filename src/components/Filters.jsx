import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, LEVELS, getCourseTheme } from '../lib/courseUi.js';

export default function Filters({ search, category, level, sort, onSearch, onCategory, onLevel, onSort, onReset }) {
  const isFiltered = Boolean(search.trim()) || category !== 'All' || level !== 'All';

  return (
    <div className="filters" aria-label="Search and filter courses">
      <div className="search-and-controls">
        <label className="search-field">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">Search courses</span>
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search courses, topics, instructors..." type="search" />
          {search && <button className="search-clear" type="button" onClick={() => onSearch('')} aria-label="Clear search"><X size={16} /></button>}
        </label>
        <div className="select-controls">
          <label className="select-wrap">
            <span className="sr-only">Filter by level</span>
            <SlidersHorizontal size={16} aria-hidden="true" />
            <select value={level} onChange={(e) => onLevel(e.target.value)}>
              <option value="All">All levels</option>
              {LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="select-wrap sort-select">
            <span className="sort-label">Sort:</span>
            <span className="sr-only">Sort courses</span>
            <select value={sort} onChange={(e) => onSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest first</option>
              <option value="title-asc">Title A–Z</option>
              <option value="duration-asc">Shortest first</option>
              <option value="duration-desc">Longest first</option>
            </select>
          </label>
        </div>
      </div>
      <div className="category-row">
        <div className="category-scroller" aria-label="Course categories">
          <button type="button" className={`category-chip ${category === 'All' ? 'selected' : ''}`} onClick={() => onCategory('All')}>All topics</button>
          {CATEGORIES.map((item) => {
            const Icon = getCourseTheme(item).icon;
            return <button key={item} type="button" className={`category-chip ${category === item ? 'selected' : ''}`} onClick={() => onCategory(item)}>
              <Icon size={15} aria-hidden="true" /> {item}
            </button>;
          })}
        </div>
        {isFiltered && <button className="reset-filters" type="button" onClick={onReset}>Reset filters <X size={14} /></button>}
      </div>
    </div>
  );
}
