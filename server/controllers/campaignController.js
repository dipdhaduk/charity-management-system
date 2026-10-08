const Campaign = require('../models/Campaign');
const Charity = require('../models/Charity');
const CampaignUpdate = require('../models/CampaignUpdate');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// @desc    Get all campaigns with search and filters
// @route   GET /api/campaigns
// @access  Public
const getCampaigns = async (req, res, next) => {
  try {
    const { category, status, location, search, charityId, featured, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status) {
      query.status = status;
    } else {
      // By default show active campaigns to public unless charity dashboard requests all
      if (!charityId) {
        query.status = { $in: ['active', 'completed'] };
      }
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (charityId) {
      query.charity = charityId;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'urgent') {
      sortOption = { endDate: 1 };
    } else if (sort === 'popular') {
      sortOption = { donorCount: -1 };
    } else if (sort === 'raised') {
      sortOption = { raisedAmount: -1 };
    }

    const campaigns = await Campaign.find(query)
      .populate('charity', 'organizationName logo isVerified city')
      .sort(sortOption);

    res.json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      'charity',
      'organizationName logo isVerified city website description registrationNumber email phone'
    );

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Fetch updates for this campaign
    const updates = await CampaignUpdate.find({ campaign: campaign._id }).sort({ createdAt: -1 });

    // Fetch recent donations for this campaign
    const recentDonations = await Donation.find({
      campaign: campaign._id,
      paymentStatus: 'success',
    })
      .populate('donor', 'name avatar')
      .sort({ donatedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      campaign,
      updates,
      recentDonations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Charity, Admin)
const createCampaign = async (req, res, next) => {
  try {
    const { title, description, category, goalAmount, image, location, startDate, endDate, status } =
      req.body;

    if (!title || !description || !category || !goalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and goal amount',
      });
    }

    // Find the charity profile for this user
    let charity = await Charity.findOne({ user: req.user._id });
    if (!charity && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Please complete your charity organization profile before creating campaigns',
      });
    }

    const charityId = charity ? charity._id : req.body.charityId;

    const campaign = await Campaign.create({
      charity: charityId,
      title,
      description,
      category,
      goalAmount: Number(goalAmount),
      image: image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      location: location || 'National',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Charity owner, Admin)
const updateCampaign = async (req, res, next) => {
  try {
    let campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // If not admin, check ownership
    if (req.user.role !== 'admin') {
      const charity = await Charity.findOne({ user: req.user._id });
      if (!charity || campaign.charity.toString() !== charity._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this campaign',
        });
      }
    }

    const updatableFields = [
      'title',
      'description',
      'category',
      'goalAmount',
      'image',
      'location',
      'startDate',
      'endDate',
      'status',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Charity owner, Admin)
const deleteCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (req.user.role !== 'admin') {
      const charity = await Charity.findOne({ user: req.user._id });
      if (!charity || campaign.charity.toString() !== charity._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this campaign',
        });
      }
    }

    await Campaign.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Campaign removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add update to campaign
// @route   POST /api/campaigns/:id/updates
// @access  Private (Charity owner, Admin)
const addCampaignUpdate = async (req, res, next) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and content for the update',
      });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    // Verify ownership
    if (req.user.role !== 'admin') {
      const charity = await Charity.findOne({ user: req.user._id });
      if (!charity || campaign.charity.toString() !== charity._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to post updates for this campaign',
        });
      }
    }

    const update = await CampaignUpdate.create({
      campaign: campaign._id,
      title,
      content,
      image: image || '',
    });

    // Notify all unique donors who supported this campaign
    const donations = await Donation.find({
      campaign: campaign._id,
      paymentStatus: 'success',
    }).select('donor');

    const uniqueDonorIds = [...new Set(donations.map((d) => d.donor?.toString()).filter(Boolean))];

    for (const donorId of uniqueDonorIds) {
      await Notification.create({
        user: donorId,
        title: `New Update: ${campaign.title}`,
        message: `${title}: ${content.slice(0, 100)}...`,
        type: 'campaign_update',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Campaign update posted and donors notified',
      update,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all updates for a campaign
// @route   GET /api/campaigns/:id/updates
// @access  Public
const getCampaignUpdates = async (req, res, next) => {
  try {
    const updates = await CampaignUpdate.find({ campaign: req.params.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: updates.length,
      updates,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate,
  getCampaignUpdates,
};
