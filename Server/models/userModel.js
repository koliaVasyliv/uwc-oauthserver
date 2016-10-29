'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validators = require('../helpers/modelHelper').validators,
    bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true },
        validate: [validators.username.func, validators.username.errMessage] },
    password: { type: String, required: true },
    email: { type: String, required: true, validate: [validators.email.func, validators.email.errMessage] },
    avatar: { src: String, originalName: String },
    bio: { type: String, validate: [validators.bio.func, validators.bio.errMessage ] },
    clients: [{ type: Schema.ObjectId, ref: 'Client' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

userSchema.pre('save', function (next) {
    let user = this;

    if (!user.updatedAt) {
        user.updatedAt  = user.createdAt;
    } else {
        user.updatedAt = Date.now();
    }

    if (!user.isModified('password')) return next();


    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    })
});


userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);