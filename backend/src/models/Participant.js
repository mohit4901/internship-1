const mongoose = require('mongoose');

/**
 * Participant — lightweight model for students submitted by a school.
 * No individual auth/login. Managed entirely by the school admin.
 */
const participantSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    class: {
      type: String,
      required: [true, 'Please specify class/grade'],
      enum: ['6', '7', '8', '9', '10', '11', '12'],
    },
    section: {
      type: String,
      trim: true,
      maxlength: [10, 'Section cannot exceed 10 characters'],
    },
    rollNo: {
      type: String,
      trim: true,
      maxlength: [30, 'Roll number cannot exceed 30 characters'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    division: {
      type: String,
      enum: ['Junior', 'Senior'],
      // Junior: Grades 6–9, Senior: Grades 10–12
    },
  },
  {
    timestamps: true,
  }
);

// Auto-assign division based on class before saving
participantSchema.pre('save', function (next) {
  const juniorClasses = ['6', '7', '8', '9'];
  if (this.class) {
    this.division = juniorClasses.includes(this.class) ? 'Junior' : 'Senior';
  }
  next();
});

// Compound index: efficient queries per school
participantSchema.index({ schoolId: 1, class: 1 });

module.exports = mongoose.model('Participant', participantSchema);
