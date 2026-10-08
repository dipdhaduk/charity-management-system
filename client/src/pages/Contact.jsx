import { useState } from 'react';
import { Mail, Clock, Send, CheckCircle2, MessageSquare, HelpCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-bg text-ink py-10 sm:py-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Get In Touch</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
          We would love to hear from you
        </h1>
        <p className="text-xs sm:text-base text-muted leading-relaxed">
          Have questions about campaigns, donations, account verification, or volunteering? Reach out to our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Support Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface rounded-card border border-line p-6 space-y-5 shadow-card">
            <h2 className="text-lg font-bold font-heading text-ink">Support & Inquiries</h2>

            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <Mail className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink">Email Support</p>
                <a href="mailto:support@charityhub.org" className="text-brand hover:underline">
                  support@charityhub.org
                </a>
                <p className="text-muted text-[11px] mt-0.5">We typically reply within 24 hours.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <Clock className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink">Helpdesk Hours</p>
                <p className="text-muted leading-relaxed">
                  Monday to Friday, 9:00 AM – 6:00 PM
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs sm:text-sm">
              <HelpCircle className="w-5 h-5 text-brand shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-ink">Campaign Verification</p>
                <p className="text-muted leading-relaxed">
                  All charity organizations and drives are verified by our platform admins before going live.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-soft border border-brand/20 rounded-card p-5 text-xs text-muted leading-relaxed">
            <span className="font-bold text-ink block mb-1">Volunteers & Non-Profits</span>
            If you are a registered organization looking to raise funds, register directly on our platform or contact us with your registration details.
          </div>
        </div>

        {/* Message Form */}
        <div className="lg:col-span-7 bg-surface rounded-featured border border-line p-6 sm:p-10 shadow-card">
          <h2 className="text-xl font-bold font-heading text-ink mb-1">Send us a message</h2>
          <p className="text-xs text-muted mb-6">
            Fill in the details below and we will get back to you shortly.
          </p>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-soft border border-brand/30 text-brand text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your message has been received. We will respond to your email.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Topic</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Donation Question">Donation & Receipts</option>
                <option value="Campaign Listing">Campaign Listing</option>
                <option value="Volunteering">Volunteering Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Message *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we help you?"
                className="w-full px-4 py-2.5 rounded-xl border border-line bg-bg text-xs text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-full shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
