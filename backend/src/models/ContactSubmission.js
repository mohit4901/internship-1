const mongoose = require('mongoose');

const contactTimelineSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  note: {
    type: String,
    required: true,
    trim: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please specify submitter name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please specify submitter email address'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Please specify contact phone number'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please specify contact ticket subject'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please write support request message']
    },
    status: {
      type: String,
      enum: ['New', 'InProgress', 'Resolved'],
      default: 'New',
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
      index: true
    },
    timeline: [contactTimelineSchema],
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound Index for dashboard sort querying on open pending logs
contactSubmissionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
