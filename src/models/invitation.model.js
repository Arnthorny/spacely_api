const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const invitationSchema = new Schema(
  {
    isValid: {
      type: Boolean,
      default: true,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    orgId: {
      type: ObjectId,
      ref: 'Organisation',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Invitation', invitationSchema);
