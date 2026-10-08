import { Link } from 'react-router-dom';
import { BadgeCheck, MapPin, Users, Clock, ArrowRight, ArrowUpRight } from 'lucide-react';
import CampaignProgress from './CampaignProgress';

export const CampaignCard = ({
  campaign,
  isFeatured = false,
  featured = false,
  onDonateClick,
  onQuickDonate,
}) => {
  if (!campaign) return null;

  const handleDonate = onDonateClick || onQuickDonate;
  const isHighPriority = isFeatured || featured;

  const {
    _id,
    title,
    category,
    image,
    charity,
    location,
    raisedAmount = 0,
    goalAmount = 1,
    donorCount = 0,
    endDate,
    status,
  } = campaign;

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!endDate) return null;
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Completed';
  };

  const daysLeft = calculateDaysLeft();
  const isCompleted = status === 'completed';

  // FEATURED HERO BANNER CARD (High-impact appeal)
  if (isHighPriority) {
    return (
      <div className="bg-brand text-white rounded-featured p-6 sm:p-8 shadow-soft flex flex-col justify-between relative overflow-hidden group">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-accent text-slate-950 shadow-2xs">
                Urgent appeal
              </span>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/15 text-white backdrop-blur-xs">
                {category}
              </span>
            </div>
            <span className="text-xs text-white/80 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {location || 'India'}
            </span>
          </div>

          <Link to={`/campaigns/${_id}`} className="block group-hover:text-accent transition">
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight font-heading">
              {title}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 text-xs text-white/90">
            <span>By {charity?.organizationName || 'CharityHub Partner'}</span>
            {charity?.isVerified && (
              <BadgeCheck className="w-4 h-4 text-accent flex-shrink-0" title="Verified NGO" />
            )}
          </div>

          <div className="pt-2">
            <CampaignProgress
              raisedAmount={raisedAmount}
              goalAmount={goalAmount}
              variant="featured"
            />
          </div>

          <div className="flex items-baseline justify-between text-sm pt-1">
            <div>
              <span className="text-2xl font-black text-white">
                ₹{raisedAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-white/70 ml-1.5">raised</span>
            </div>
            <span className="text-xs text-white/70">
              of ₹{goalAmount.toLocaleString('en-IN')} goal
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-white/80">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {donorCount} donors
            </span>
            {daysLeft && (
              <span className="flex items-center gap-1 font-semibold text-accent">
                <Clock className="w-3.5 h-3.5" />
                {daysLeft}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              if (handleDonate) {
                e.preventDefault();
                handleDonate(campaign);
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-slate-950 font-bold text-sm rounded-full transition shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Donate now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // STANDARD PRODUCTION CARD (Inspired by Reference Images)
  return (
    <div className="bg-surface rounded-card border border-line shadow-card hover:shadow-soft hover:border-brand/40 transition duration-200 flex flex-col overflow-hidden group">
      {/* Cover image container */}
      <div className="relative h-48 w-full overflow-hidden bg-line/20">
        <img
          src={
            image ||
            'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
          loading="lazy"
        />
        {/* Status and category tags */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {isCompleted ? (
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-slate-900 text-white shadow-2xs">
                Completed
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-amber-400 text-slate-950 shadow-2xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                Active
              </span>
            )}
            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-surface/90 text-ink shadow-2xs backdrop-blur-xs">
              {category}
            </span>
          </div>

          <Link
            to={`/campaigns/${_id}`}
            aria-label={`View details of ${title}`}
            className="w-7 h-7 rounded-full bg-surface/90 hover:bg-surface text-ink flex items-center justify-center shadow-xs transition backdrop-blur-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* NGO & Location header */}
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="font-semibold text-ink flex items-center gap-1 truncate max-w-[65%]">
              {charity?.organizationName || 'CharityHub Partner'}
              {charity?.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-brand shrink-0" title="Verified NGO" />
              )}
            </span>
            <span className="flex items-center gap-1 truncate text-muted text-[11px]">
              <MapPin className="w-3 h-3" />
              {location || 'India'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/campaigns/${_id}`} className="block">
            <h3 className="font-bold text-ink text-base leading-snug line-clamp-2 hover:text-brand transition font-heading">
              {title}
            </h3>
          </Link>
        </div>

        {/* Progress & Quick Actions */}
        <div className="space-y-3 pt-1">
          <CampaignProgress
            raisedAmount={raisedAmount}
            goalAmount={goalAmount}
            showLabels={false}
          />

          <div className="flex items-baseline justify-between text-xs">
            <div>
              <span className="font-extrabold text-ink text-sm">
                ₹{raisedAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-muted ml-1 text-[11px]">raised</span>
            </div>
            <span className="text-muted text-[11px]">
              of ₹{goalAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-line">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-muted" />
              <span>{donorCount} donors</span>
            </span>
            {daysLeft && (
              <span className="flex items-center gap-1 font-medium text-ink">
                <Clock className="w-3.5 h-3.5 text-muted" />
                <span>{daysLeft}</span>
              </span>
            )}
          </div>

          <div className="pt-1 flex gap-2">
            <Link
              to={`/campaigns/${_id}`}
              className="flex-1 py-2 px-3 text-center border border-line hover:border-brand/40 text-ink text-xs font-semibold rounded-full transition"
            >
              Details
            </Link>
            <button
              type="button"
              onClick={(e) => {
                if (handleDonate) {
                  e.preventDefault();
                  handleDonate(campaign);
                }
              }}
              disabled={isCompleted}
              className="flex-1 py-2 px-4 bg-brand hover:bg-brand-hover disabled:opacity-50 text-white text-xs font-bold rounded-full transition shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
