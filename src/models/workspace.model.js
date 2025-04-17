const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const workspaceSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'available',
      enum: ['available', 'unavailable', 'booked', 'checkedIn'],
    },
    hubId: {
      type: ObjectId,
      ref: 'Hub',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Workspace', workspaceSchema);
