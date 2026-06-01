const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide the school or institution name'],
      trim: true
    },
    affiliationNumber: {
      type: String,
      required: [true, 'Please provide the school affiliation number'],
      unique: true,
      trim: true,
      index: true
    },
    board: {
      type: String,
      required: [true, 'Please specify the educational board'],
      enum: ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge']
    },
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        required: [true, 'Please specify the city location'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'Please specify the state location'],
        trim: true
      },
      zip: {
        type: String,
        required: [true, 'Please specify the postal area zip code'],
        trim: true
      },
      country: {
        type: String,
        default: 'India',
        trim: true
      }
    },
    contactEmail: {
      type: String,
      required: [true, 'Please provide primary school contact email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid school email address'
      ]
    },
    contactPhone: {
      type: String,
      required: [true, 'Please provide school contact phone number'],
      trim: true
    },
    principalName: {
      type: String,
      trim: true
    },
    coordinator: {
      name: {
        type: String,
        required: [true, 'Please provide BAIO school coordinator name'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Please provide coordinator phone number'],
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Please provide coordinator email address'],
        lowercase: true,
        trim: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid coordinator email'
        ]
      }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    registeredStudentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Compound Index for local geographical reports queries
schoolSchema.index({ 'address.city': 1, 'address.state': 1 });

module.exports = mongoose.model('School', schoolSchema);
