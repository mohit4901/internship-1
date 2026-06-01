const mongoose = require('mongoose');

const olympiadRegistrationSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Please provide the registration reference number'],
      unique: true,
      trim: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Please specify the registered student profile ID'],
      index: true
    },
    olympiadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Olympiad',
      required: [true, 'Please specify the target Olympiad event ID'],
      index: true
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      default: null
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true
    },
    examCenter: {
      name: {
        type: String,
        trim: true
      },
      address: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true,
        index: true
      },
      roomNumber: {
        type: String,
        trim: true
      }
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
      index: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null
    },
    registrationStatus: {
      type: String,
      enum: ['Initiated', 'Confirmed', 'Cancelled'],
      default: 'Initiated'
    },
    hallTicketUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Unique Compound Index to prevent a student from double-registering to the same olympiad category
olympiadRegistrationSchema.index({ studentId: 1, olympiadId: 1 }, { unique: true });

// Compound index for sponsored school lists retrieval
olympiadRegistrationSchema.index({ schoolId: 1, paymentStatus: 1 });

module.exports = mongoose.model('OlympiadRegistration', olympiadRegistrationSchema);
