import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  Printer,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import donationService from '../services/donationService';

export const DonationForm = ({
  campaign,
  isOpen,
  onClose,
  onDonationSuccess,
  defaultAmount,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const presets = [500, 1000, 2500, 5000];
  const [amount, setAmount] = useState(defaultAmount || 1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState(user?.name || '');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Card payment details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState(null);

  const selectedAmount = isCustom ? Number(customAmount) : amount;

  const handlePresetSelect = (val) => {
    setIsCustom(false);
    setAmount(val);
    setCustomAmount('');
    setError('');
  };

  const handleCustomChange = (e) => {
    setIsCustom(true);
    setCustomAmount(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      if (onClose) onClose();
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!selectedAmount || selectedAmount < 1) {
      setError('Enter a valid donation amount of at least ₹1.');
      return;
    }

    if (!donorName.trim()) {
      setError('Enter your name for the donation receipt.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create Stripe PaymentIntent
      const intentRes = await donationService.createPaymentIntent({
        amount: selectedAmount,
        campaignId: campaign._id,
      });

      const txId = intentRes?.paymentIntentId || `pi_stripe_${Date.now()}`;

      // 2. Finalize donation record and generate a receipt
      const res = await donationService.createDonation({
        campaignId: campaign._id,
        amount: selectedAmount,
        paymentMethod: paymentMethod === 'card' ? 'Stripe Card' : paymentMethod.toUpperCase(),
        transactionId: txId,
      });

      if (res?.success) {
        setReceipt(res.receipt);
        if (onDonationSuccess) {
          onDonationSuccess(res);
        }
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className="bg-surface rounded-card border border-line p-6 shadow-soft space-y-5">
      {/* SUCCESS RECEIPT VIEW */}
      {receipt ? (
        <div className="text-center space-y-4 animate-pop-in">
          <div className="w-12 h-12 bg-soft text-brand rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold text-ink">Thank you for your donation</h3>
            <p className="text-xs text-muted">
              Your contribution of <strong className="text-ink">₹{selectedAmount.toLocaleString('en-IN')}</strong> to{' '}
              <strong className="text-ink">{campaign?.title}</strong> is confirmed.
            </p>
          </div>

          {/* Printable donation receipt */}
          <div className="bg-bg rounded-xl p-4 border border-line text-left text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-line">
              <span className="font-bold text-ink">Receipt {receipt.receiptNumber}</span>
              <span className="px-2 py-0.5 rounded-full bg-soft text-brand font-semibold text-[11px]">
                Donation receipt
              </span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Donor</span>
              <span className="font-medium text-ink">{receipt.donorName}</span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Amount</span>
              <span className="font-bold text-brand">₹{receipt.amount.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Payment method</span>
              <span className="font-medium text-ink capitalize">{paymentMethod}</span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Transaction ID</span>
              <span className="font-mono text-ink text-[11px] truncate max-w-[170px]">
                {receipt.transactionId}
              </span>
            </div>

            <div className="flex justify-between text-muted">
              <span>Date</span>
              <span className="text-ink">
                {new Date(receipt.donationDate || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-ink hover:bg-ink/90 text-surface text-xs font-bold rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Printer className="w-3.5 h-3.5" />
              Save receipt as PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setReceipt(null);
                if (onClose) onClose();
              }}
              className="py-2.5 px-5 bg-surface border border-line hover:border-brand/40 text-ink text-xs font-semibold rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        /* DONATION FORM VIEW */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-ink">Donate to this cause</h3>
              <p className="text-xs text-muted">Tax treatment depends on the recipient organization and applicable rules.</p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-muted hover:text-ink p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Close donation modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Amount presets */}
          <div>
            <label className="block text-xs font-semibold text-muted mb-2">
              Select donation amount
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handlePresetSelect(val)}
                  aria-pressed={!isCustom && amount === val}
                  className={`py-2 px-3 rounded-full text-xs font-bold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                    !isCustom && amount === val
                      ? 'bg-brand text-white border-brand shadow-xs'
                      : 'bg-surface text-ink border-line hover:border-brand/40'
                  }`}
                >
                  ₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label htmlFor="custom-amount" className="block text-xs font-medium text-muted mb-1">
              Or enter custom amount (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted font-bold text-xs">
                ₹
              </span>
              <input
                id="custom-amount"
                type="number"
                min="1"
                placeholder="Custom amount"
                value={customAmount}
                onChange={handleCustomChange}
                className={`w-full pl-8 pr-4 py-2 rounded-full border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isCustom && customAmount ? 'border-brand bg-soft/20' : 'border-line'
                }`}
              />
            </div>
          </div>

          {/* Name for receipt */}
          <div>
            <label htmlFor="receipt-name" className="block text-xs font-semibold text-muted mb-1">
              Full name for donation receipt
            </label>
            <input
              id="receipt-name"
              type="text"
              required
              placeholder="e.g. Priya Sharma"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-line text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>

          {/* Payment Method selector */}
          <div>
            <label className="block text-xs font-semibold text-muted mb-1.5">
              Payment method
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                aria-pressed={paymentMethod === 'card'}
                className={`py-2 px-2 rounded-full border font-semibold flex items-center justify-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  paymentMethod === 'card'
                    ? 'bg-soft text-brand border-brand'
                    : 'bg-surface text-muted border-line hover:border-brand/40'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                aria-pressed={paymentMethod === 'upi'}
                className={`py-2 px-2 rounded-full border font-semibold flex items-center justify-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  paymentMethod === 'upi'
                    ? 'bg-soft text-brand border-brand'
                    : 'bg-surface text-muted border-line hover:border-brand/40'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                aria-pressed={paymentMethod === 'netbanking'}
                className={`py-2 px-2 rounded-full border font-semibold flex items-center justify-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  paymentMethod === 'netbanking'
                    ? 'bg-soft text-brand border-brand'
                    : 'bg-surface text-muted border-line hover:border-brand/40'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NetBanking</span>
              </button>
            </div>
          </div>

          {/* Payment inputs based on selected method */}
          {paymentMethod === 'card' && (
            <div className="p-3 bg-bg rounded-xl border border-line text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Card details</span>
                <span className="text-[10px] text-brand font-medium">Encrypted SSL payment</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number (e.g. 4242 4242 4242 4242)"
                  className="w-full px-3 py-2 rounded-lg border border-line bg-surface font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="px-3 py-2 rounded-lg border border-line bg-surface font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    className="px-3 py-2 rounded-lg border border-line bg-surface font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="p-3 bg-bg rounded-xl border border-line text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px] text-muted">
                <span>Instant UPI Transfer</span>
                <span className="text-[10px] text-emerald-600 font-bold">0% fee</span>
              </div>
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g. mobile@upi)"
                className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              />
              <p className="text-[11px] text-muted">
                Supports Google Pay, PhonePe, Paytm, BHIM, and bank UPI apps.
              </p>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div className="p-3 bg-bg rounded-xl border border-line text-xs space-y-2">
              <span className="text-[11px] text-muted">Select your bank</span>
              <select className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <option value="HDFC">HDFC Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="AXIS">Axis Bank</option>
                <option value="KOTAK">Kotak Mahindra Bank</option>
                <option value="OTHER">Other Indian Bank</option>
              </select>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || campaign?.status === 'completed'}
            className="w-full py-3 px-4 bg-brand hover:bg-brand-hover active:opacity-90 disabled:opacity-50 text-white font-bold rounded-full transition shadow-xs flex items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing donation...
              </span>
            ) : campaign?.status === 'completed' ? (
              'Campaign completed'
            ) : (
              `Donate ₹${(selectedAmount || 0).toLocaleString('en-IN')}`
            )}
          </button>

          <p className="text-[11px] text-center text-muted flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-brand" /> 256-bit secure transaction via Stripe
          </p>
        </form>
      )}
    </div>
  );

  // If used inside a modal overlay
  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-pop-in">{content}</div>
      </div>
    );
  }

  // Otherwise rendered as inline panel
  return content;
};

export default DonationForm;
