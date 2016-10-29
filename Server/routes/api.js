'use strict';

const apiRouter = require('express').Router(),
    passport = require('passport');

module.exports = function (User, Client, Code, Token) {

    const oauth2Controller = require('../controllers/oauth2Controller')(User, Client, Code, Token);
    const apiController = require('../controllers/apiController')(User);


    apiRouter.route('/:email')
        .get(apiController.getAvatar);

    apiRouter.route('/oauth2/authorize')
        .get(passport.authenticate(['basic', 'bearer'], { session: false }),
            oauth2Controller.server.authorize(function (clientId, redirectUri, done) {
                Client.findById(clientId, function (err, client) {
                    if (err) return done(err);
                    if (!client) return done(null, false);
                    //if (!client.redirectUri !== redirectUri) return done(null, false);

                    return done(null, client, redirectUri);

                });
            }),
            oauth2Controller.getDialog)
        .post(passport.authenticate(['basic', 'bearer'], { session: false }), oauth2Controller.decision);

    apiRouter.route('/oauth2/token')
        .post(passport.authenticate('client-basic', { session: false }), oauth2Controller.token,
            oauth2Controller.server.errorHandler());


    apiRouter.route('/users/:username')
        .get(passport.authenticate('bearer', { session: false }), apiController.getUser);

    return apiRouter;
};

