let stripeInstance = null;

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeInstance && secretKey && secretKey.startsWith('sk_') && !secretKey.includes('placeholder')) {
    try {
      stripeInstance = require('stripe')(secretKey);
    } catch (e) {
      console.warn('Failed to initialize Stripe client:', e.message);
    }
  }
  return stripeInstance;
};

const createStripePaymentIntent = async ({ amount, currency = 'inr', metadata = {}, description = '' }) => {
  const stripe = getStripe();

  // If a live/test Stripe key is configured, create real Stripe PaymentIntent
  if (stripe) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(amount) * 100), // convert to smallest unit (paise/cents)
        currency: currency.toLowerCase(),
        metadata,
        description,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        isLiveStripe: true,
      };
    } catch (err) {
      console.warn('Stripe API error, falling back to simulated payment intent:', err.message);
    }
  }

  // Graceful fallback for local development without personal Stripe credentials
  const mockId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  return {
    clientSecret: `${mockId}_secret_${Math.random().toString(36).substring(2, 9)}`,
    paymentIntentId: mockId,
    isLiveStripe: false,
  };
};

module.exports = {
  createStripePaymentIntent,
};
