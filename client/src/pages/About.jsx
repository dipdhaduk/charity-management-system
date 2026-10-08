import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Heart,
  Target,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  HelpCircle,
  Users,
  Eye,
  HandHeart,
} from 'lucide-react';

export const About = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash]);

  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Verified Non-Profits',
      desc: 'Every charity organization and campaign undergoes thorough administrative verification before public fundraising begins.',
    },
    {
      icon: Eye,
      title: '100% Transparency',
      desc: 'Charities publish regular milestone updates with photo evidence and expenditure reports visible to all donors.',
    },
    {
      icon: HandHeart,
      title: 'Direct Community Impact',
      desc: 'Contributions directly reach the selected cause without hidden intermediary deductions.',
    },
    {
      icon: Users,
      title: 'Active Volunteer Network',
      desc: 'Connecting passionate individuals with verified field initiatives to multiply real-world impact.',
    },
  ];

  const faqs = [
    {
      q: 'How does CharityHub verify campaigns?',
      a: 'All organizations must submit valid registration documents, identification, and campaign details. Our administrative team reviews every appeal before it is published.',
    },
    {
      q: 'How can donors track the impact of their contributions?',
      a: 'Organizers post milestone progress updates directly to the campaign page. Donors can view real-time fund utilization and visual proof of work.',
    },
    {
      q: 'Do donors receive receipts for contributions?',
      a: 'Yes. An official digital donation receipt with a unique transaction reference is generated immediately upon successful payment and stored in your profile.',
    },
    {
      q: 'Can anyone apply to volunteer for drives?',
      a: 'Yes! Registered donors and community members can apply to open volunteer drives across healthcare, food relief, and education initiatives.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-ink py-10 sm:py-16 space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft text-brand text-xs font-bold border border-brand/20">
          <Heart className="w-3.5 h-3.5 fill-brand" />
          <span>Transparent Giving Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto leading-tight">
          Connecting compassion with verified community impact
        </h1>
        <p className="text-muted text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
          CharityHub is a modern donation management platform designed to make charitable giving transparent, accountable, and accessible to everyone.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/campaigns"
            className="px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-bold shadow-xs transition"
          >
            Explore Campaigns
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2.5 rounded-full bg-surface hover:bg-soft border border-line text-ink text-xs sm:text-sm font-semibold transition"
          >
            Contact Team
          </Link>
        </div>
      </section>

      {/* 2. VISION & MISSION */}
      <section id="vision" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-surface rounded-featured border border-line p-6 sm:p-12 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center font-black">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand">Our Purpose</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading mt-1">Our Vision & Mission</h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-muted leading-relaxed">
              <div className="p-4 rounded-card bg-bg border border-line">
                <h3 className="font-bold text-ink text-sm sm:text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand" /> Our Vision
                </h3>
                <p className="mt-1.5">
                  A society where every genuine cause receives the resources, trust, and hands-on community support it needs to make a lasting difference.
                </p>
              </div>
              <div className="p-4 rounded-card bg-bg border border-line">
                <h3 className="font-bold text-ink text-sm sm:text-base flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand" /> Our Mission
                </h3>
                <p className="mt-1.5">
                  To eliminate the trust gap in donations through verified charity profiles, transparent milestone updates, and seamless volunteer coordination.
                </p>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-line aspect-4/3 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80"
              alt="Community volunteering and support"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <p className="text-white text-xs sm:text-sm font-medium">
                Verified causes, direct fundraising, and engaged local volunteers working together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY */}
      <section id="story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">The Foundation</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">Our Story</h2>
          <p className="text-muted text-xs sm:text-sm">
            How CharityHub was created to bring clarity and accountability to community fundraising.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-surface rounded-card border border-line space-y-3">
            <div className="w-10 h-10 rounded-xl bg-soft text-brand font-bold flex items-center justify-center font-heading text-sm">
              01
            </div>
            <h3 className="font-bold text-ink text-base">The Challenge</h3>
            <p className="text-xs text-muted leading-relaxed">
              Donors often want to help local causes but lack certainty regarding where their funds go, while smaller genuine charities struggle to gain donor trust.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-card border border-line space-y-3">
            <div className="w-10 h-10 rounded-xl bg-soft text-brand font-bold flex items-center justify-center font-heading text-sm">
              02
            </div>
            <h3 className="font-bold text-ink text-base">The Platform Solution</h3>
            <p className="text-xs text-muted leading-relaxed">
              We built CharityHub to provide verifiable milestone updates, real-time donation progress, digital receipts, and integrated volunteer coordination in one place.
            </p>
          </div>

          <div className="p-6 bg-surface rounded-card border border-line space-y-3">
            <div className="w-10 h-10 rounded-xl bg-soft text-brand font-bold flex items-center justify-center font-heading text-sm">
              03
            </div>
            <h3 className="font-bold text-ink text-base">The Community Today</h3>
            <p className="text-xs text-muted leading-relaxed">
              Today, donors, grassroots charities, and volunteers unite across causes including healthcare, education, emergency relief, and community welfare.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">What Drives Us</p>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-surface rounded-card border border-line p-5 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-soft text-brand flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-ink text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FAQS & TRANSPARENCY */}
      <section id="faqs" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">Frequently Asked Questions</h2>
          <p className="text-muted text-xs sm:text-sm">Common questions about donating and campaign transparency.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-surface rounded-card border border-line p-5 space-y-2">
              <h3 className="font-bold text-ink text-sm sm:text-base flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
