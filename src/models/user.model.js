const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
    org: {
      type: ObjectId,
      ref: 'Organisation',
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', UserSchema);
