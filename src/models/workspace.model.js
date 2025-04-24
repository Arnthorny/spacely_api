const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const workspaceSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      default: 'Desk',
    },
    number: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'available',
      enum: ['available', 'unavailable', 'booked', 'checkedIn'],
    },
    hub: {
      type: ObjectId,
      ref: 'Hub',
      required: true,
    },
    bookingHistory: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Workspace', workspaceSchema);
