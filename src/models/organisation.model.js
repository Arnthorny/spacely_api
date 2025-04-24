const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const orgDetailsSchema = new Schema({
  roles: {
    type: Array,
    default: ['learner', 'employee', 'admin'],
  },
  roleWorkSpaceAccess: {
    type: Object,
  },
});

const OrganisationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },

    owner: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    organisationSpecific: orgDetailsSchema,
  },
  {
    timestamps: true,
  },
);

OrganisationSchema.index({ name: 'text' });

module.exports = mongoose.model('Organisation', OrganisationSchema);
