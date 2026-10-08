const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate,
  getCampaignUpdates,
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, authorize('charity', 'admin'), createCampaign);
router.put('/:id', protect, authorize('charity', 'admin'), updateCampaign);
router.delete('/:id', protect, authorize('charity', 'admin'), deleteCampaign);

// Updates
router.get('/:id/updates', getCampaignUpdates);
router.post('/:id/updates', protect, authorize('charity', 'admin'), addCampaignUpdate);

module.exports = router;
