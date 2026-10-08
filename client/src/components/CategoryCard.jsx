import { Link } from 'react-router-dom';
import {
  GraduationCap,
  HeartPulse,
  Utensils,
  Home,
  Trees,
  Cat,
  FlameKindling,
  Sparkles,
} from 'lucide-react';

const iconsMap = {
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Food: Utensils,
  Housing: Home,
  Environment: Trees,
  Animals: Cat,
  'Disaster Relief': FlameKindling,
};

export const CategoryCard = ({ category, count = 0, isSelected, onClick }) => {
  const Icon = iconsMap[category] || Sparkles;

  if (onClick) {
    return (
      <button
        type="button"
        role="button"
        aria-pressed={!!isSelected}
        onClick={() => onClick(category)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand whitespace-nowrap ${
          isSelected
            ? 'bg-brand text-white border-brand shadow-xs'
            : 'bg-surface text-ink border-line hover:border-brand/40'
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{category}</span>
        {count > 0 && (
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-full ${
              isSelected ? 'bg-white/20 text-white' : 'bg-soft text-brand'
            }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <Link
      to={`/campaigns?category=${encodeURIComponent(category)}`}
      className="group bg-surface rounded-card border border-line p-4 sm:p-5 shadow-card hover:border-brand/40 transition flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div className="w-12 h-12 rounded-full bg-soft text-brand flex items-center justify-center mb-3 group-hover:bg-brand group-hover:text-white transition">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-ink">{category}</h4>
      <p className="text-xs text-muted mt-1">View appeals</p>
    </Link>
  );
};

export default CategoryCard;
