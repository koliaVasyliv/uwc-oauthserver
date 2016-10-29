'use strict';

let mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');


const tokenSchema = new Schema({
    value: { type: String, required: true },
    userId: { type: Schema.ObjectId, required: true },
    clientId: { type: Schema.ObjectId, required: true }
});

// tokenSchema.pre('save', function (next) {
//     let token = this;
//
//     if (!token.isModified('value')) return next();
//
//     bcrypt.genSalt(10, function (err, salt) {
//         if(err) return next(err);
//
//         bcrypt.hash(token.value, salt, null, function (err, hash) {
//             if (err) return next(err);
//             token.value = hash;
//             next();
//         })
//     })
// });

module.exports = mongoose.model('Token', tokenSchema);
