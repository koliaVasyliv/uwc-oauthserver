'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ModelHelper = require('../helpers/modelHelper');

const clientSchema = new Schema({
    name: String,
    cb_url: { type: String },
    owner: { type: Schema.ObjectId, ref: 'User' },
    users: [{ type: Schema.ObjectId }],
    secret: String,
    clientId: String,
});

clientSchema.pre('save', function (next) {
    let client = this;
    if (!client.isModified()) return next();

    if (!client.secret) {
        client.secret = ModelHelper.uid(16);
    }

    next();
});


module.exports = mongoose.model('Client', clientSchema);
