const mongoose = require('mongoose');

// CSV Item Schema
const csvItemSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// CSV Distribution Schema
const csvDistributionSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  distributions: [{
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: true
    },
    items: [csvItemSchema],
    itemCount: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['processing', 'completed', 'failed'],
    default: 'processing'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CSVDistribution', csvDistributionSchema);