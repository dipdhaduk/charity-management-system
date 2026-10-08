const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  createDonation,
  getMyDonations,
  getDonationById,
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/', protect, createDonation);
router.get('/my', protect, getMyDonations);
router.get('/:id', protect, getDonationById);


module.exports = router;
