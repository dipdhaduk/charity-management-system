const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllCharities,
  getPendingCharities,
  verifyCharity,
  getAllCampaigns,
  getAllDonations,
  getAllVolunteers,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes are protected and require 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);
router.get('/charities', getAllCharities);
router.get('/charities/pending', getPendingCharities);
router.put('/charities/:id/verify', verifyCharity);
router.get('/campaigns', getAllCampaigns);
router.get('/donations', getAllDonations);
router.get('/volunteers', getAllVolunteers);

module.exports = router;
