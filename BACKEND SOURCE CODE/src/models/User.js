const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'Bio cannot exceed 300 characters'],
    },
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'mr'],
    },
    interests: {
      type: [String],
      default: [],
    },
    mobility: {
      type: String,
      default: 'full',
      enum: ['full', 'limited', 'wheelchair', 'assisted'],
    },
    ageGroup: {
      type: String,
      default: 'adult',
      enum: ['child', 'teen', 'young_adult', 'adult', 'senior'],
    },
    preferences: {
      travelTime: { type: String, default: '1-2 hours' },
      audioPreference: { type: Boolean, default: true },
      budget: { type: String, default: 'medium', enum: ['low', 'medium', 'high'] },
      travelGroup: { type: String, default: 'solo' },
    },
    accessibility: {
      largeText: { type: Boolean, default: false },
      highContrast: { type: Boolean, default: false },
      simpleLanguage: { type: Boolean, default: false },
      audioGuidance: { type: Boolean, default: false },
      reducedMotion: { type: Boolean, default: false },
    },
    savedSites: {
      type: [String],
      default: [],
    },
    recentlyViewed: {
      type: [String],
      default: [],
    },
    audioHistory: {
      type: [String],
      default: [],
    },
    sitesExplored: {
      type: Number,
      default: 0,
    },
    storiesHeard: {
      type: Number,
      default: 0,
    },
    placesSaved: {
      type: Number,
      default: 0,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return sanitized user object
userSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
