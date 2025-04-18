const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const hubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    org: {
      type: ObjectId,
      ref: 'Organisation',
      required: true,
    },
    // All time is stored relative to "1970-01-01T00:00:00.000Z"
    openingTime: {
      type: Date,
      required: true,
    },
    closingTime: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availableDays: {
      type: Array,
      required: true,
      default: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Hub', hubSchema);
