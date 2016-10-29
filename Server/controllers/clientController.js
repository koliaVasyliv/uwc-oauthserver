'use strict';
const getErrorMessages = require('./userController').getErrorMessages;

module.exports = function (User, Client) {

    function getClients(req, res) {
        User.findById(req.user.id).populate('clients').exec((err, user) => {
            if(err) {
                res.status(500).render('error', { error: err });
            }
            res.render('clients', { user: user });
        });
    }

    function createClient(req, res) {
        User.findById(req.user.id, function (err, user) {
            if (err) {
                res.status(500).render('error', { error: err });
            }
            let client = new Client(req.body);
            client.owner = user.id;
            client.save().then(newClient => {
                user.clients.push(newClient);
                user.save().then(newUser => {
                    res.redirect('/');
                });
            }).catch(err => {
                res.render('clients', { messages: getErrorMessages(err), user: req.user });
            });
        });
    }

    function getClient(req, res) {
        Client.findOne({ name: req.params.name }, function (err, client) {
            if (err) {
                res.status(500).render('error', { error: err });
            }
            res.render('client', { client: client, user: req.user });
        });
    }

    return {
        getClients: getClients,
        createClient: createClient,
        getClient: getClient
    }
};