'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Key"
const COLLECTION_NAME = "keys"

// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Shop"
  },
  publicKey: {
    type: String,
    required: true
  },
  privateKey: {
    type: String,
    required: true
  },
  refreshTokensUsed: {
    type: Array,
    default: []
  },
  refreshToken: {
    type: String,
    required: true
  }
},
  {
    timeseries: true,
    collection: COLLECTION_NAME
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);