// USER MODEL REQUIRES
const { Schema, model } = require('mongoose');

// USER SCHEMA
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    profilePic: String,
    password: { type: String, select: false },
    registerType: { type: String, default: 'emailPassword' },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive'],
      default: 'pending',
    },
    stripeCustomerID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    selectedPlan: {
      type: String,
      enum: ['trial', 'basic', 'premium', 'none'],
      default: 'none',
    },
    endDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// USER MODEL
const User = model('User', userSchema);

// EXPORTS
module.exports = User;
