import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-bg text-ink py-10 sm:py-16 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft text-brand text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Compliance & Donor Safety</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight">
          Terms, Conditions & Donor Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted">
          Last updated: October 2026 • Valid for all CharityHub donors and participating organizations.
        </p>
      </div>

      <div className="bg-surface rounded-featured border border-line p-6 sm:p-10 shadow-card space-y-8 text-xs sm:text-sm leading-relaxed text-muted">
        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-ink flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand" /> 1. Donor Privacy Commitment
          </h2>
          <p>
            CharityHub maintains a strict donor privacy policy. We will never sell, trade, rent, or share a donor's personal contact information or payment credentials with any unauthorized third party. All personal data is encrypted using 256-bit SSL protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-ink flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand" /> 2. Tax Exemption & 80G Receipts
          </h2>
          <p>
            Donations made through this platform are eligible for deduction under Section 80G of the Income Tax Act where indicated. Official receipts with the 80G order reference number are generated digitally upon payment success and accessible at any time under your donor account profile.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-ink flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand" /> 3. Utilization & Milestone Tracking
          </h2>
          <p>
            Contributions are dedicated solely to the designated cause or campaign chosen by the donor. Verified charities are contractually required to upload periodic milestone reports, photos of field distribution, and audited expenditure summaries.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold font-heading text-ink flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand" /> 4. Refund Policy
          </h2>
          <p>
            Since charitable contributions directly fund immediate nutritional supplies, educational materials, and healthcare operations, contributions are non-refundable once disbursed. In the case of duplicate or erroneous transactions, refund requests submitted to support@charityhub.org within 7 days will be reviewed by our financial desk.
          </p>
        </section>

        <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-muted">Questions regarding our policies?</span>
          <Link
            to="/contact"
            className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-full hover:bg-brand-hover transition shadow-xs"
          >
            Contact Compliance Desk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Terms;
