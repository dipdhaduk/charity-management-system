const mongoose = require('mongoose');

const campaignUpdateSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Update content is required'],
    },
    image: {
      type: String,
      default: '',
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

module.exports = mongoose.model('CampaignUpdate', campaignUpdateSchema);
