'use strict';
const express = require('express'),
    userRouter = express.Router(),
    passport = require('passport');

module.exports = function (User, Client, upload) {
    const userController = require('../controllers/userController')(User, Client);


    userRouter.route('/login')
        .get((req, res) => res.render('login'))
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signup'
        }));

    userRouter.route('/signup')
        .get((req, res) => res.render('signup'))
        .post(userController.signUp);

    userRouter.route('/logout')
        .get(userController.logout);

    userRouter.route('/:username')
        .all(userController.checkAuthentication)
        .get(userController.getUser)
        .post(upload.single('avatar'), userController.createUser);

    return userRouter;
};
