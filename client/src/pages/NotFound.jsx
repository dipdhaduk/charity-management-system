import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 bg-soft text-brand rounded-full flex items-center justify-center mb-4">
        <Compass className="w-7 h-7" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink font-heading">
        Page not found
      </h1>
      <p className="mt-2 text-xs sm:text-sm text-muted max-w-sm leading-relaxed">
        The link you followed may be broken or the page may have been moved to another location.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-full text-xs transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        Return to home
      </Link>
    </div>
  );
};

export default NotFound;
