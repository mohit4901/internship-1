const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Please specify the CMS content key'],
      unique: true,
      trim: true,
      index: true
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please specify the CMS content value']
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Cms', cmsSchema);
