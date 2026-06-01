const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please specify the announcement title'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please specify the announcement content']
    },
    category: {
      type: String,
      enum: ['General', 'Schedule', 'OlympiadInfo', 'Emergency'],
      default: 'General'
    },
    targetAudience: {
      type: String,
      enum: ['All', 'Junior', 'Senior', 'Masters', 'Schools'],
      default: 'All',
      index: true
    },
    olympiadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Olympiad',
      default: null,
      index: true
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, 'Please specify active author ID']
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true
    },
    publishedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index for quick catalog lists loading sorted by pin state and dates
announcementSchema.index({ publishedAt: -1, isPinned: -1 });

// Compound index for quick targeted user dashboards lookup
announcementSchema.index({ targetAudience: 1, publishedAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
