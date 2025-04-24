const mongoose = require('mongoose');
const passwordGen = require('generate-password');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const bookingSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['cancelled', 'pending', 'checkedIn'],
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    workspace: {
      type: ObjectId,
      ref: 'Workspace',
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

bookingSchema.pre('save', function preSaveCode(next) {
  this.code = passwordGen.generate({
    length: 8,
    lowercase: false,
    numbers: true,
    strict: true,
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
