import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-line bg-surface text-ink transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg font-heading text-lg font-extrabold tracking-tight group"
              aria-label="CharityHub Homepage"
            >
              <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center shadow-xs transition duration-200 group-hover:bg-brand-hover">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-ink">
                Charity<span className="text-brand">Hub</span>
              </span>
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              A transparent community donation platform connecting donors with verified charity campaigns and causes.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/" className="hover:text-brand transition">Home</Link>
              </li>
              <li>
                <Link to="/campaigns" className="hover:text-brand transition">Explore Campaigns</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand transition">Who We Are</Link>
              </li>
              <li>
                <Link to="/our-work" className="hover:text-brand transition">What We Do</Link>
              </li>
            </ul>
          </div>

          {/* Community & Involvement */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-heading">
              Get Involved
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/dashboard/volunteer" className="hover:text-brand transition">Volunteer Hub</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand transition">Start a Campaign</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand transition">Support & Contact</Link>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink font-heading">
              Policies
            </h4>
            <ul className="space-y-2 text-xs text-muted">
              <li>
                <Link to="/terms" className="hover:text-brand transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand transition">Contact Helpdesk</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} CharityHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-brand transition">Terms</Link>
            <Link to="/terms" className="hover:text-brand transition">Privacy</Link>
            <Link to="/contact" className="hover:text-brand transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
