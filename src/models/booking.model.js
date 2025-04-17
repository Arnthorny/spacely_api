const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const bookingSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['cancelled', 'pending', 'checkedIn'],
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    workspaceId: {
      type: ObjectId,
      ref: 'Workspace',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', bookingSchema);
