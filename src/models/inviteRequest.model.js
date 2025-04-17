const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const inviteRequestSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['approved', 'pending', 'rejected'],
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

module.exports = mongoose.model('InviteRequest', inviteRequestSchema);
