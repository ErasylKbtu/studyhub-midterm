import {
  Braces, ChartNoAxesCombined, Palette, BriefcaseBusiness,
  Sparkles, Megaphone, CalendarCheck2, ShieldCheck,
} from 'lucide-react';

export const CATEGORIES = [
  'Development', 'Data Science', 'Design', 'Business',
  'AI & Automation', 'Marketing', 'Productivity', 'Cybersecurity',
];

export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const CATEGORY_UI = {
  Development: { icon: Braces, tone: 'development', short: 'Code' },
  'Data Science': { icon: ChartNoAxesCombined, tone: 'data', short: 'Data' },
  Design: { icon: Palette, tone: 'design', short: 'Design' },
  Business: { icon: BriefcaseBusiness, tone: 'business', short: 'Business' },
  'AI & Automation': { icon: Sparkles, tone: 'ai', short: 'AI' },
  Marketing: { icon: Megaphone, tone: 'marketing', short: 'Marketing' },
  Productivity: { icon: CalendarCheck2, tone: 'productivity', short: 'Productivity' },
  Cybersecurity: { icon: ShieldCheck, tone: 'cyber', short: 'Security' },
};

export function getCourseTheme(category) {
  return CATEGORY_UI[category] ?? CATEGORY_UI.Development;
}

export function formatDuration(hours) {
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
}
