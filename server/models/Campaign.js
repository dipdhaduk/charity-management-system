const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Education',
        'Healthcare',
        'Food',
        'Housing',
        'Environment',
        'Animals',
        'Disaster Relief',
      ],
    },
    goalAmount: {
      type: Number,
      required: [true, 'Goal amount is required'],
      min: [1, 'Goal amount must be greater than 0'],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    },
    location: {
      type: String,
      default: 'National',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'cancelled'],
      default: 'active',
    },
    donorCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

campaignSchema.virtual('progress').get(function () {
  if (!this.goalAmount || this.goalAmount <= 0) return 0;
  const percentage = (this.raisedAmount / this.goalAmount) * 100;
  return Math.min(100, Math.round(percentage * 10) / 10);
});

module.exports = mongoose.model('Campaign', campaignSchema);
