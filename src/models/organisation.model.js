const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const orgDetailsSchema = new Schema({
  roles: {
    type: Array,
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

    ownerId: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    organisationSpecific: orgDetailsSchema,
  },
  {
    timestamps: true,
    methods: {
      to_json() {
        const jsonObj = {
          id: this.id,
          email: this.email,
          ownerId: this.ownerId,
        };
        return jsonObj;
      },
    },
  },
);

module.exports = mongoose.model('Organisation', OrganisationSchema);
