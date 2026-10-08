const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  applyOpportunity,
  getMyApplications,
  getCharityApplications,
  updateApplicationStatus,
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/opportunities', getOpportunities);
router.get('/opportunities/:id', getOpportunityById);
router.post('/opportunities', protect, authorize('charity', 'admin'), createOpportunity);
router.post('/apply', protect, applyOpportunity);
router.get('/my-applications', protect, getMyApplications);
router.get('/charity-applications', protect, authorize('charity', 'admin'), getCharityApplications);
router.put('/applications/:id', protect, authorize('charity', 'admin'), updateApplicationStatus);

module.exports = router;
