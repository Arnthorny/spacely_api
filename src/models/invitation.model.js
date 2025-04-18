const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const invitationSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['approved', 'pending', 'rejected', 'expired', 'used'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    org: {
      type: ObjectId,
      ref: 'Organisation',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Invitation', invitationSchema);
