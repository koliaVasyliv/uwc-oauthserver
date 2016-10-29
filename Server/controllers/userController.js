'use strict';
const fs = require('fs'),
    queue = require('kue').createQueue(),
    request = require('request');

module.exports = function (User, Client) {

    function checkAuthentication(req, res, next) {
        if(req.isAuthenticated() && req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    function getUser(req, res) {
        res.render('user', { user: req.user });
    }

    function signUp(req, res) {
        let user = new User(req.body);
        user.save().then(result => {
            req.login(result._doc, function () {
                res.redirect(`/${result.username}`);
            });
        }).catch(err => {
            res.render('signup', { messages: getErrorMessages(err)});
        });
    }

    function createUser(req, res) {
        User.findById(req.user._id, function (err, user) {
            if(err) {
                res.status(500).render('error', { error: err });
            }
            if(req.file) {
                avatarUpdate(user, req);
            }
            Object.keys(req.body).forEach(v => {
                user[v] = req.body[v] || '';
            });
            user.save().then(result => {
                if (result.createdAt !== result.updatedAt) {
                    getFollowersClients(result._id, Client, function (data) {
                        createWebhooksTasks(data, User);
                    });
                }
                res.render('user', {user: result});

            }).catch(err => {
                res.render('user', { messages: getErrorMessages(err), user: user});
            });
        });
    }

    function logout(req, res) {
        req.logout();
        res.redirect('/');
    }

    return {
        checkAuthentication: checkAuthentication,
        getUser: getUser,
        signUp: signUp,
        createUser: createUser,
        logout: logout
    }
};


/**
 * Get clients where user registered
 * @param {string} userId
 * @param {object} Client
 * @param {function} cb
 * Callback get object with 'clients' and 'userId'
 */
function getFollowersClients(userId, Client, cb) {
    Client.find({ users: userId}, 'name cb_url', function (err, clients) {
        if (err) throw err;
        cb({ clients: clients, userId: userId });
    });
}

/**
 * Create background tasks to send webhooks to clients about user updates
 * @param {object} data - consists clients
 * @param {object} User - model
 */
function createWebhooksTasks(data, User) {
    data.clients.forEach(function (client) {
        queue.create('webhook', {userId: data.userId, cb_url: client.cb_url, params: data.params})
            .delay(1000).attempts(20).backoff({type: 'exponential'}).save();
    });
    process.nextTick(function () {
        queue.process('webhook', function (job, done) {
            User.findById(job.data.userId, 'username bio email avatar',function (err, user) {
                request({
                    url: job.data.cb_url,
                    method: 'POST',
                    json: user
                }, function (error) {
                    if (error) {
                        done(error);
                    } else {
                        done();
                    }
                });
            });
        });
    });
}

/**
 * Update avatar image. If user have already avatar,  function
 * will delete previous one at first and then saved new
 * @param {object} user
 * @param {object} req
 */
function avatarUpdate(user, req) {
    let imagePath = req.file.path.split('/');
    imagePath = imagePath.slice(imagePath.length - 3, imagePath.length).join('/');
    if (user.avatar.src) {
        deleteImage(user.avatar.src)
    }
    user.avatar.src = imagePath || null;
    user.avatar.originalname = req.file.originalname || null;
}

function deleteImage() {
    const imPath = path.resolve(__dirname, '../public', src);
    try {
        fs.unlinkSync(imPath);
    } catch (err) {
        console.log(err);
    }
}

/**
 * Return errors messages defined in Schemas validation
 * @param err
 * @returns {Array} messages
 */
function getErrorMessages(err) {
    let messages = [];
    if(err.errors) {
        for(var key in err.errors) {
            messages.push(err.errors[key].message);
        }
    } else {
        messages[0] = err.message;
    }
    return messages;
}
module.exports.getErrorMessages = getErrorMessages;