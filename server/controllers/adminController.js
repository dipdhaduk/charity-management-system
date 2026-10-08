const User = require('../models/User');
const Charity = require('../models/Charity');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const VolunteerApplication = require('../models/VolunteerApplication');
const Notification = require('../models/Notification');

// @desc    Get system-wide overview statistics & charts data
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res, next) => {
  try {
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'success' });

    // Aggregate total donation amount
    const donationSum = await Donation.aggregate([
      { $match: { paymentStatus: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalDonationAmount = donationSum.length > 0 ? donationSum[0].total : 0;

    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' });
    const verifiedCharities = await Charity.countDocuments({ isVerified: true });
    const pendingCharities = await Charity.countDocuments({ verificationStatus: 'pending' });
    const registeredUsers = await User.countDocuments();
    const volunteerUsers = await User.countDocuments({ role: 'volunteer' });

    // Category breakdown for charts
    const categoryStats = await Campaign.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          raised: { $sum: '$raisedAmount' },
          goal: { $sum: '$goalAmount' },
        },
      },
    ]);

    // Monthly donation trend (last 6 months or all)
    const donationsTrend = await Donation.aggregate([
      { $match: { paymentStatus: 'success' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$donatedAt' } },
          amount: { $sum: '$amount' },
          donationsCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Role breakdown
    const roleStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalDonations,
        totalDonationAmount,
        activeCampaigns,
        completedCampaigns,
        verifiedCharities,
        pendingCharities,
        registeredUsers,
        volunteers: volunteerUsers,
      },
      charts: {
        categories: categoryStats,
        trend: donationsTrend,
        roles: roleStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Deactivated)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect self-deactivation
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own admin account',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all charities for admin
// @route   GET /api/admin/charities
// @access  Private (Admin)
const getAllCharities = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.verificationStatus = status;

    const charities = await Charity.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: charities.length,
      charities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending charities
// @route   GET /api/admin/charities/pending
// @access  Private (Admin)
const getPendingCharities = async (req, res, next) => {
  try {
    const charities = await Charity.find({ verificationStatus: 'pending' })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: charities.length,
      charities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or reject charity
// @route   PUT /api/admin/charities/:id/verify
// @access  Private (Admin)
const verifyCharity = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status',
      });
    }

    const charity = await Charity.findById(req.params.id);
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    charity.verificationStatus = status;
    charity.isVerified = status === 'approved';
    await charity.save();

    // Notify charity owner
    if (charity.user) {
      await Notification.create({
        user: charity.user,
        title: `Charity Verification: ${status.toUpperCase()}`,
        message:
          status === 'approved'
            ? `Congratulations! "${charity.organizationName}" has been verified. You can now launch active campaigns.`
            : `Your verification request for "${charity.organizationName}" was ${status}.`,
        type: 'verification',
      });
    }

    res.json({
      success: true,
      message: `Charity verification status updated to ${status}`,
      charity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all campaigns for admin
// @route   GET /api/admin/campaigns
// @access  Private (Admin)
const getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find()
      .populate('charity', 'organizationName isVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations for admin
// @route   GET /api/admin/donations
// @access  Private (Admin)
const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .populate('campaign', 'title category')
      .populate('charity', 'organizationName')
      .sort({ donatedAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all volunteer opportunities & applications for admin
// @route   GET /api/admin/volunteers
// @access  Private (Admin)
const getAllVolunteers = async (req, res, next) => {
  try {
    const opportunities = await VolunteerOpportunity.find()
      .populate('charity', 'organizationName')
      .sort({ createdAt: -1 });

    const applications = await VolunteerApplication.find()
      .populate('volunteer', 'name email phone')
      .populate({
        path: 'opportunity',
        populate: { path: 'charity', select: 'organizationName' },
      })
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      opportunities,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllCharities,
  getPendingCharities,
  verifyCharity,
  getAllCampaigns,
  getAllDonations,
  getAllVolunteers,
};
