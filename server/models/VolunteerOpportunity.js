const mongoose = require('mongoose');

const volunteerOpportunitySchema = new mongoose.Schema(
  {
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    volunteersNeeded: {
      type: Number,
      default: 5,
      min: 1,
    },
    location: {
      type: String,
      default: 'On-site / Community',
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
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

module.exports = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);
