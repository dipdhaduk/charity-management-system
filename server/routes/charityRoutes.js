const express = require('express');
const router = express.Router();
const {
  getCharities,
  getCharityById,
  getMyCharityProfile,
  createCharity,
  updateCharity,
} = require('../controllers/charityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getCharities);
router.get('/me', protect, authorize('charity', 'admin'), getMyCharityProfile);
router.get('/:id', getCharityById);
router.post('/', protect, authorize('charity', 'admin'), createCharity);
router.put('/:id', protect, authorize('charity', 'admin'), updateCharity);

module.exports = router;
