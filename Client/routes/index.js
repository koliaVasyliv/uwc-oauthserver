var express = require('express');
var router = express.Router(),
    request = require('request');

// Pass here your clientId and secret that you get in webservice
let clientId = '57e2ee8a144e2e0ffd1da8da',
    secret = '5Z2RIb8SDWeKX89X',
    auth = 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64');

router.get('/', function(req, res) {
    if (req.query.code) {
        postCode(req.query.code, function (err, data) {
            if (err) throw err;
            getUser(data, function (err, user) {
                if (err) throw err;
                res.json(user);
            });
        });
    } else {
        res.render('index', { clientId: clientId });
    }
});

router.post('/', function (req, res) {
    console.log(JSON.stringify(req.body));
    res.json(req.body);
});

function postCode(code, cb) {
    request({
        url: 'http://localhost:3000/api/oauth2/token',
        method: 'POST',
        headers: {
            'Authorization': auth
        },
        form: {
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:3001'
        }
    }, function (err, response, body) {
        if (err) {
            cb(err);
        } else {
            cb(null, JSON.parse(body));
        }
    });
}

function getUser(data, cb) {
    request({
        url: 'http://localhost:3000/api/users/kolia2801?bio&username',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + data.access_token.value
        }
    }, function (err, response, body) {
        if (err) {
            cb(err);
        } else {
            cb(null, JSON.parse(body));
        }
    });
}

module.exports = router;
