const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const Charity = require('../models/Charity');
const Receipt = require('../models/Receipt');
const Notification = require('../models/Notification');
const generateReceipt = require('../utils/generateReceipt');
const { createStripePaymentIntent } = require('../utils/stripeService');

// @desc    Create Stripe PaymentIntent
// @route   POST /api/donations/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res, next) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid campaign and donation amount',
      });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const currency = process.env.STRIPE_CURRENCY || 'inr';
    const intent = await createStripePaymentIntent({
      amount: Number(amount),
      currency,
      metadata: {
        campaignId: campaign._id.toString(),
        donorId: req.user._id.toString(),
        donorEmail: req.user.email,
        donorName: req.user.name,
      },
      description: `Donation for ${campaign.title} via CharityHub`,
    });

    res.json({
      success: true,
      clientSecret: intent.clientSecret,
      paymentIntentId: intent.paymentIntentId,
      isLiveStripe: intent.isLiveStripe,
      currency,
      amount: Number(amount),
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Create a new donation with receipt generation
// @route   POST /api/donations
// @access  Private (Donor, Volunteer, Admin, Charity)
const createDonation = async (req, res, next) => {
  try {
    const { campaignId, amount, paymentMethod, transactionId } = req.body;

    if (!campaignId || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid campaign and donation amount',
      });
    }

    const campaign = await Campaign.findById(campaignId).populate('charity');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (campaign.status === 'completed' || campaign.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `This campaign is currently ${campaign.status} and cannot accept donations`,
      });
    }

    // Generate or verify unique transaction ID to prevent duplicate payments
    const txId = transactionId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const existingTx = await Donation.findOne({ transactionId: txId });
    if (existingTx) {
      return res.status(409).json({
        success: false,
        message: 'A donation with this transaction ID has already been processed',
      });
    }

    // Check if this donor has already donated to this campaign before
    const previousDonation = await Donation.findOne({
      donor: req.user._id,
      campaign: campaign._id,
      paymentStatus: 'success',
    });

    const parsedAmount = Number(amount);

    // 1. Create donation record
    const donation = await Donation.create({
      donor: req.user._id,
      campaign: campaign._id,
      charity: campaign.charity ? campaign.charity._id : null,
      amount: parsedAmount,
      paymentMethod: paymentMethod || 'Mock Card/UPI',
      transactionId: txId,
      paymentStatus: 'success',
      donatedAt: new Date(),
    });

    // 2. Increase campaign raisedAmount
    campaign.raisedAmount += parsedAmount;

    // 3. Increase donorCount only if this donor is a new supporter of this campaign
    if (!previousDonation) {
      campaign.donorCount += 1;
    }

    // If raised amount meets or exceeds goal, can mark completed if goal reached
    if (campaign.raisedAmount >= campaign.goalAmount) {
      // Keep it active or completed
    }

    await campaign.save();

    // 4. Generate receipt
    const receipt = await generateReceipt({
      donationId: donation._id,
      donorName: req.user.name,
      amount: parsedAmount,
      campaignName: campaign.title,
      transactionId: txId,
    });

    // 5. Create notifications
    // Notification for donor
    await Notification.create({
      user: req.user._id,
      title: 'Donation Successful!',
      message: `Thank you for donating ₹${parsedAmount.toLocaleString('en-IN')} to "${campaign.title}". Receipt #${receipt.receiptNumber} generated.`,
      type: 'donation_success',
    });

    // Notification for charity owner
    if (campaign.charity && campaign.charity.user) {
      await Notification.create({
        user: campaign.charity.user,
        title: 'New Donation Received!',
        message: `${req.user.name} donated ₹${parsedAmount.toLocaleString('en-IN')} to "${campaign.title}".`,
        type: 'donation_received',
      });
    }

    // 6. Return response
    res.status(201).json({
      success: true,
      message: 'Donation processed successfully',
      donation,
      receipt,
      campaignProgress: campaign.progress,
      campaignRaised: campaign.raisedAmount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's donations
// @route   GET /api/donations/my
// @access  Private
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('campaign', 'title image category goalAmount raisedAmount charity')
      .populate('charity', 'organizationName logo')
      .sort({ donatedAt: -1 });

    // Fetch receipts for these donations
    const donationIds = donations.map((d) => d._id);
    const receipts = await Receipt.find({ donation: { $in: donationIds } });

    const receiptsMap = {};
    receipts.forEach((r) => {
      receiptsMap[r.donation.toString()] = r;
    });

    const enriched = donations.map((d) => {
      const doc = d.toObject();
      doc.receipt = receiptsMap[d._id.toString()] || null;
      return doc;
    });

    res.json({
      success: true,
      count: enriched.length,
      donations: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone')
      .populate('campaign', 'title category goalAmount raisedAmount image')
      .populate('charity', 'organizationName logo email phone address');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Donor, charity owner or admin can view
    const isDonor = donation.donor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isCharityOwner =
      req.user.role === 'charity' &&
      donation.charity &&
      donation.charity.user?.toString() === req.user._id.toString();

    if (!isDonor && !isAdmin && !isCharityOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this donation receipt',
      });
    }

    const receipt = await Receipt.findOne({ donation: donation._id });

    res.json({
      success: true,
      donation,
      receipt,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  createDonation,
  getMyDonations,
  getDonationById,
};
