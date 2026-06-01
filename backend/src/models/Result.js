const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OlympiadRegistration',
      required: [true, 'Please associate this result to a registration entry'],
      unique: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Please associate this result to a student profile'],
      index: true
    },
    olympiadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Olympiad',
      required: [true, 'Please associate this result to an Olympiad event'],
      index: true
    },
    rollNumber: {
      type: String,
      required: [true, 'Please specify the participant roll number'],
      unique: true,
      trim: true,
      index: true
    },
    scores: {
      logicalReasoning: {
        type: Number,
        required: [true, 'Please specify Logical Reasoning score'],
        min: 0
      },
      algorithmicThinking: {
        type: Number,
        required: [true, 'Please specify Algorithmic Thinking score'],
        min: 0
      },
      aiCore: {
        type: Number,
        required: [true, 'Please specify AI Core score'],
        min: 0
      },
      totalMarksObtained: {
        type: Number,
        required: [true, 'Please specify accumulated marks total'],
        min: 0,
        index: true
      }
    },
    totalMaxMarks: {
      type: Number,
      required: true,
      default: 100
    },
    percentage: {
      type: Number,
      required: [true, 'Please specify performance percentage calculation']
    },
    percentile: {
      type: Number,
      required: [true, 'Please specify computed national percentile ranking']
    },
    rankings: {
      national: {
        type: Number,
        required: [true, 'Please specify National Rank position'],
        index: true
      },
      state: {
        type: Number,
        required: [true, 'Please specify State Rank position']
      },
      school: {
        type: Number,
        default: null
      }
    },
    qualificationStatus: {
      type: String,
      enum: ['Qualified', 'Participated', 'MeritAwardee', 'NationalRanker'],
      default: 'Participated'
    },
    scorecardUrl: {
      type: String,
      trim: true
    },
    certificateUrl: {
      type: String,
      trim: true
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    },
    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound Sorting Index for fast national rankings boards compilation queries
resultSchema.index({ olympiadId: 1, 'scores.totalMarksObtained': -1 });

module.exports = mongoose.model('Result', resultSchema);
