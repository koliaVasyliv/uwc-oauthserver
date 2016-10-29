'use strict';


module.exports = function (User) {


    function getUser(req, res) {
        let projection = '';
        Object.keys(req.query).forEach(v => {
            projection.concat(v, ' ');
        });
        projection = projection.length > 0 ? projection : 'username bio avatar email';
        User.findById(req.user.id, projection, function (err, user) {
            if (err) throw err;
            res.json(user);
        })
    }

    function getAvatar(req, res) {
        User.findOne({email: req.params.email }, function (err, user) {
            let newPath = require('path').resolve(__dirname, '../public', user.avatar.src);
            res.sendFile(newPath, { headers: { 'Content-Disposition': 'inline', 'Content-Type': 'image/jpeg' }});
        });
    }
    return {
        getUser: getUser,
        getAvatar: getAvatar
    }
};