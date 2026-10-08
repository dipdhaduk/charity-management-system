const VolunteerOpportunity = require('../models/VolunteerOpportunity');
const VolunteerApplication = require('../models/VolunteerApplication');
const Charity = require('../models/Charity');
const Notification = require('../models/Notification');

// @desc    Get all volunteer opportunities
// @route   GET /api/volunteers/opportunities
// @access  Public
const getOpportunities = async (req, res, next) => {
  try {
    const { status, charityId, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (charityId) query.charity = charityId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const opportunities = await VolunteerOpportunity.find(query)
      .populate('charity', 'organizationName logo city isVerified')
      .populate('campaign', 'title category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single opportunity
// @route   GET /api/volunteers/opportunities/:id
// @access  Public
const getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id)
      .populate('charity', 'organizationName logo city email phone website isVerified')
      .populate('campaign', 'title category image');

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Volunteer opportunity not found' });
    }

    res.json({ success: true, opportunity });
  } catch (error) {
    next(error);
  }
};

// @desc    Create volunteer opportunity
// @route   POST /api/volunteers/opportunities
// @access  Private (Charity, Admin)
const createOpportunity = async (req, res, next) => {
  try {
    const { title, description, volunteersNeeded, location, date, campaignId } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    let charity = await Charity.findOne({ user: req.user._id });
    if (!charity && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You need an active charity profile to create volunteer opportunities',
      });
    }

    const charityId = charity ? charity._id : req.body.charityId;

    const opportunity = await VolunteerOpportunity.create({
      charity: charityId,
      campaign: campaignId || null,
      title,
      description,
      volunteersNeeded: volunteersNeeded ? Number(volunteersNeeded) : 5,
      location: location || 'On-site / Community',
      date: date || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer opportunity posted successfully',
      opportunity,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for volunteer opportunity
// @route   POST /api/volunteers/apply
// @access  Private
const applyOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, message } = req.body;

    if (!opportunityId) {
      return res.status(400).json({
        success: false,
        message: 'Opportunity ID is required',
      });
    }

    const opportunity = await VolunteerOpportunity.findById(opportunityId).populate('charity');
    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found' });
    }

    if (opportunity.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This volunteer opportunity is no longer open',
      });
    }

    // Check existing application
    const existing = await VolunteerApplication.findOne({
      volunteer: req.user._id,
      opportunity: opportunityId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity',
      });
    }

    const application = await VolunteerApplication.create({
      volunteer: req.user._id,
      opportunity: opportunityId,
      message: message || 'I would love to help out!',
      status: 'pending',
    });

    // Notify charity owner
    if (opportunity.charity && opportunity.charity.user) {
      await Notification.create({
        user: opportunity.charity.user,
        title: 'New Volunteer Application',
        message: `${req.user.name} applied for "${opportunity.title}".`,
        type: 'volunteer_application',
      });
    }

    // Notify user
    await Notification.create({
      user: req.user._id,
      title: 'Application Submitted',
      message: `Your application for "${opportunity.title}" was submitted successfully.`,
      type: 'volunteer_status',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's volunteer applications
// @route   GET /api/volunteers/my-applications
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await VolunteerApplication.find({ volunteer: req.user._id })
      .populate({
        path: 'opportunity',
        populate: [
          { path: 'charity', select: 'organizationName logo city' },
          { path: 'campaign', select: 'title' },
        ],
      })
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for charity's opportunities
// @route   GET /api/volunteers/charity-applications
// @access  Private (Charity, Admin)
const getCharityApplications = async (req, res, next) => {
  try {
    let charity = await Charity.findOne({ user: req.user._id });
    if (!charity && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Charity not found' });
    }

    const opportunities = await VolunteerOpportunity.find(
      req.user.role === 'admin' ? {} : { charity: charity._id }
    ).select('_id');

    const oppIds = opportunities.map((o) => o._id);

    const applications = await VolunteerApplication.find({ opportunity: { $in: oppIds } })
      .populate('volunteer', 'name email phone avatar')
      .populate('opportunity', 'title location date volunteersNeeded')
      .sort({ appliedAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (approve / reject)
// @route   PUT /api/volunteers/applications/:id
// @access  Private (Charity, Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be pending, approved, or rejected',
      });
    }

    const application = await VolunteerApplication.findById(req.params.id)
      .populate('volunteer', 'name email')
      .populate({
        path: 'opportunity',
        populate: { path: 'charity' },
      });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify authorization
    if (req.user.role !== 'admin') {
      const charity = await Charity.findOne({ user: req.user._id });
      if (
        !charity ||
        application.opportunity.charity._id.toString() !== charity._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to manage this application',
        });
      }
    }

    application.status = status;
    await application.save();

    // Send notification to volunteer
    await Notification.create({
      user: application.volunteer._id,
      title: `Volunteer Application ${status.toUpperCase()}`,
      message: `Your application for "${application.opportunity.title}" was ${status}.`,
      type: 'volunteer_status',
    });

    res.json({
      success: true,
      message: `Application marked as ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  applyOpportunity,
  getMyApplications,
  getCharityApplications,
  updateApplicationStatus,
};
