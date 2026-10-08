const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema(
  {
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    donorName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Receipt', receiptSchema);
