'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');


const codeSchema = new Schema({
    value: { type: String, required: true },
    redirectUri: { type: String, required: true },
    userId: { type: Schema.ObjectId, require: true },
    clientId: { type: Schema.ObjectId, required: true }
});


// codeSchema.pre('save', function (next) {
//     let code = this;
//
//     if (!code.isModified('authCode')) return next();
//
//     bcrypt.genSalt(10, function (err, salt) {
//         if (err) return next(err);
//
//         bcrypt.hash(code.value, salt, null, function (err, hash) {
//             if (err) return next(err);
//             code.value = hash;
//             next();
//         });
//     })
// });


module.exports = mongoose.model('Code', codeSchema);