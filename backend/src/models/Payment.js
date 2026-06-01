const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OlympiadRegistration',
      required: [true, 'Please associate this payment to a registration record'],
      unique: true,
      index: true
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Please associate this payment to a student account'],
      index: true
    },
    gateway: {
      type: String,
      required: [true, 'Please specify active payment aggregator gateway'],
      enum: ['Razorpay', 'Stripe']
    },
    amount: {
      type: Number,
      required: [true, 'Please specify checkout amount paid'],
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true
    },
    gatewayOrderId: {
      type: String,
      required: [true, 'Please specify gateway order ID reference'],
      unique: true,
      index: true
    },
    gatewayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    gatewaySignature: {
      type: String,
      select: false
    },
    status: {
      type: String,
      enum: ['Created', 'Captured', 'Failed', 'Refunded'],
      default: 'Created',
      index: true
    },
    errorCode: {
      type: String
    },
    errorDescription: {
      type: String
    },
    refundDetails: {
      refundId: { type: String, trim: true },
      amount: { type: Number, min: 0 },
      refundedAt: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

// Compound index for audit logging and timeline calculations
paymentSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
