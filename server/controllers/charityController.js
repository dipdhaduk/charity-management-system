const Charity = require('../models/Charity');
const Campaign = require('../models/Campaign');
const Notification = require('../models/Notification');

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
const getCharities = async (req, res, next) => {
  try {
    const { status, verified, search } = req.query;
    let query = {};

    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }
    if (status) {
      query.verificationStatus = status;
    }
    if (search) {
      query.$or = [
        { organizationName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const charities = await Charity.find(query)
      .populate('user', 'name email avatar')
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

// @desc    Get charity by ID with its campaigns
// @route   GET /api/charities/:id
// @access  Public
const getCharityById = async (req, res, next) => {
  try {
    const charity = await Charity.findById(req.params.id).populate('user', 'name email phone avatar');

    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    const campaigns = await Campaign.find({ charity: charity._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      charity,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in charity's profile
// @route   GET /api/charities/me
// @access  Private (Charity)
const getMyCharityProfile = async (req, res, next) => {
  try {
    let charity = await Charity.findOne({ user: req.user._id });
    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity profile not found' });
    }
    res.json({ success: true, charity });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or register a charity organization
// @route   POST /api/charities
// @access  Private (Charity, Admin)
const createCharity = async (req, res, next) => {
  try {
    const {
      organizationName,
      description,
      registrationNumber,
      email,
      phone,
      address,
      city,
      state,
      website,
      logo,
    } = req.body;

    // Check if user already has a charity
    const existing = await Charity.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have an existing charity profile',
      });
    }

    const charity = await Charity.create({
      user: req.user._id,
      organizationName,
      description,
      registrationNumber,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      address,
      city,
      state,
      website,
      logo: logo || undefined,
      verificationStatus: 'pending',
      isVerified: false,
    });

    res.status(201).json({
      success: true,
      message: 'Charity profile submitted for verification',
      charity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update charity profile
// @route   PUT /api/charities/:id
// @access  Private (Charity owner or Admin)
const updateCharity = async (req, res, next) => {
  try {
    let charity = await Charity.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    // Must be charity owner or admin
    if (charity.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this charity profile',
      });
    }

    const allowedUpdates = [
      'organizationName',
      'description',
      'registrationNumber',
      'email',
      'phone',
      'address',
      'city',
      'state',
      'website',
      'logo',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        charity[field] = req.body[field];
      }
    });

    await charity.save();

    res.json({
      success: true,
      message: 'Charity profile updated',
      charity,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCharities,
  getCharityById,
  getMyCharityProfile,
  createCharity,
  updateCharity,
};
