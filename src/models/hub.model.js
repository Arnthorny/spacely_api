const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const hubSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    floorMapURL: {
      type: String,
      required: false,
      default: 'https://placehold.co/1200x300/2C6ECB/FFFFFF?text=FLOOR+MAP',
    },
    org: {
      type: ObjectId,
      ref: 'Organisation',
      required: true,
    },
    // 24hr string
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    maxBookingMinutes: {
      type: Number,
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
