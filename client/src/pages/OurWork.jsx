import { Link } from 'react-router-dom';
import {
  Heart,
  Stethoscope,
  GraduationCap,
  Apple,
  ShieldAlert,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const OurWork = () => {
  const causes = [
    {
      id: 'healthcare',
      title: 'Healthcare & Medical Aid',
      tag: 'Critical Care',
      desc: 'Supporting individuals and families with urgent medical treatments, critical surgeries, prescription supplies, and clinical healthcare equipment.',
      icon: Stethoscope,
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      actionUrl: '/campaigns?category=Healthcare',
      actionLabel: 'View Healthcare Appeals',
    },
    {
      id: 'education',
      title: 'Education & Child Welfare',
      tag: 'Empowering Youth',
      desc: 'Funding learning resources, school fees, books, and educational supplies for underprivileged students and children from vulnerable backgrounds.',
      icon: GraduationCap,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      actionUrl: '/campaigns?category=Education',
      actionLabel: 'Support Education Causes',
    },
    {
      id: 'food',
      title: 'Food Relief & Nutrition',
      tag: 'Hunger Relief',
      desc: 'Delivering essential grocery kits, wholesome nutrition parcels, and emergency food supplies to communities facing economic distress.',
      icon: Apple,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      actionUrl: '/campaigns?category=Food',
      actionLabel: 'Sponsor Food Relief',
    },
    {
      id: 'disaster',
      title: 'Disaster Relief & Response',
      tag: 'Emergency Aid',
      desc: 'Rapid mobilization of critical supplies, temporary shelters, blankets, and essential relief kits for families affected by natural disasters and humanitarian crises.',
      icon: ShieldAlert,
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80',
      actionUrl: '/campaigns?category=Disaster Relief',
      actionLabel: 'Support Disaster Aid',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft text-brand text-xs font-bold border border-brand/20">
          <Heart className="w-3.5 h-3.5 fill-brand" />
          <span>Active Cause Categories</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto">
          What We Do: Empowering Verified Causes
        </h1>
        <p className="text-muted text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          Through CharityHub, certified grassroots organizations coordinate fundraising and volunteer support across essential humanitarian sectors.
        </p>
      </section>

      {/* 2. CAUSES LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {causes.map((item, idx) => {
          const Icon = item.icon;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={item.id}
              className={`bg-surface rounded-featured border border-line p-6 sm:p-10 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                isEven ? '' : 'lg:grid-flow-dense'
              }`}
            >
              <div
                className={`space-y-4 lg:col-span-7 ${
                  isEven ? '' : 'lg:col-start-6'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-soft text-brand text-xs font-bold">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.tag}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-ink">
                  {item.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
                <div className="pt-2">
                  <Link
                    to={item.actionUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-full shadow-xs transition"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              <div
                className={`lg:col-span-5 relative rounded-2xl overflow-hidden border border-line aspect-4/3 shadow-sm ${
                  isEven ? '' : 'lg:col-start-1'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. VOLUNTEER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-soft border border-brand/20 rounded-featured p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-ink">
            Volunteer On The Ground
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Every cause needs hands as well as hearts. Apply directly to verified volunteer drives and support community initiatives in your area.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/campaigns"
              className="px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold shadow-xs transition"
            >
              Explore Campaigns
            </Link>
            <Link
              to="/dashboard/volunteer"
              className="px-6 py-2.5 rounded-full bg-surface hover:bg-bg border border-line text-ink text-xs sm:text-sm font-semibold transition"
            >
              Volunteer Hub
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurWork;
