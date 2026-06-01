const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  subtopics: [
    {
      type: String,
      trim: true
    }
  ]
}, { _id: false });

const olympiadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the Olympiad event title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide the Olympiad event description']
    },
    category: {
      type: String,
      required: [true, 'Please specify active age/education category track'],
      enum: ['Junior', 'Senior', 'Masters'],
      index: true
    },
    gradesSupported: [
      {
        type: String,
        enum: ['6', '7', '8', '9', '10', '11', '12', 'UG']
      }
    ],
    registrationFee: {
      type: Number,
      required: [true, 'Please specify the registration fee in currency units'],
      min: [0, 'Fee cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true
    },
    timeline: {
      registrationStart: {
        type: Date,
        required: [true, 'Please specify registration opening date']
      },
      registrationEnd: {
        type: Date,
        required: [true, 'Please specify registration closing deadline'],
        index: true
      },
      examDate: {
        type: Date,
        required: [true, 'Please specify examination conduct date'],
        index: true
      }
    },
    syllabus: [syllabusSchema],
    syllabusPdf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },
    bannerImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Media'
    },
    rules: [
      {
        type: String,
        trim: true
      }
    ],
    maxRegistrations: {
      type: Number,
      default: 0 // 0 indicates infinite or unrestricted seats
    },
    currentRegistrationsCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'RegistrationClosed', 'Finished'],
      default: 'Draft',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for category and event sorting query optimizations
olympiadSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Olympiad', olympiadSchema);
