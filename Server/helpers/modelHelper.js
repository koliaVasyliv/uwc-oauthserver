'use strict';

let validators = {};

validators.username = {
    func: function(v) {
        return /^[a-zA-Z0-9]+$/i.test(v);
    },
    errMessage: 'Username can only consist of letters and numbers'
};

validators.email = {
    func: function (v)  {
        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v);
    },
    errMessage: 'Not valid email address.'
};

validators.bio = {
    func: function (v) {
        return v.length <= 120 ;
    },
    errMessage: 'Biography must be less than 120 letters.'
};

module.exports.uid = function(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.validators = validators;