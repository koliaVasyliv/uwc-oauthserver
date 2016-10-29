'use strict';

const oauth2orize = require('oauth2orize'),
    uid = require('../helpers/modelHelper').uid;

module.exports = function (User, Client, Code, Token) {

    const server = oauth2orize.createServer();
    
    server.serializeClient(function (client, done) {
        return done(null, client._id);
    });

    server.deserializeClient(function (id, done) {
        Client.findById(id, function (err, client) {
            if (err) return done(err);
            return done(null, client);
        });
    });

    server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, done) {
        let code = new Code({
            value: uid(16),
            clientId: client._id,
            redirectUri: redirectUri,
            userId: user._id
        });
        Client.findById(client._id, function (err, client) {
            if (err) done(err);

            client.users.push(user._id);
            client.save().then(newClient => {
                return code.save();
            }).then(result => {
                done(null, result.value);
            }).catch(err => {
                done(err);
            });
        });
    }));

    server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, done) {
        Code.findOne({ value: code }, function (err, code) {
            if (err) return done(err);
            if(code === undefined) return done(null, false);
            if (client.id != code.clientId.toString()) return done(null, false);
            if(redirectUri !== code.redirectUri) return done(null, false);

            const token = new Token({
                value: uid(256),
                userId: code.userId,
                clientId: code.clientId
            });
            token.save().then(result => {
                done(null, result);
            }).catch(err => {
                done(err);
            });
        });
    }));

    function authorize() {
        return server.authorization(function (clientId, redirectUri, done) {
            Client.findById(clientId, function (err, client) {
                if (err) return done(err);
                if (!client) return done(null, false);
                if (!client.redirectUri !== redirectUri) return done(null, false);

                return cb(null, client, redirectUri);

            });
        });
    }
    
    function getDialog(req, res) {
        res.render('dialog', { transactionID: req.oauth2.transactionID,
            user: req.user, client: req.oauth2.client });
    }

    
    return {
        authorize: authorize(),
        getDialog: getDialog,
        decision: server.decision(),
        token: [server.token(), server.errorHandler()],
        server: server
    };
};

