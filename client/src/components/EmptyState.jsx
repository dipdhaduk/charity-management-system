import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = SearchX,
  title = 'No campaigns found',
  description = 'Try selecting another cause or clear your search to see active appeals.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 sm:p-14 bg-surface rounded-card border border-line text-center shadow-card">
      <div className="w-14 h-14 bg-soft text-brand rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-muted max-w-md leading-relaxed">{description}</p>
      {actionLabel && (actionLink || onAction) && (
        <div className="mt-6">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center px-6 py-2.5 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
