const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    multer = require('multer'),
    upload = multer({ dest: 'public/uploads/images/' });

const conf = require('./config/config');
const db = mongoose.connect(conf.mongo.url() + '/sss');

//Get Models
const User = require('./models/userModel'),
    Client = require('./models/clientModel'),
    Token = require('./models/tokenModel'),
    Code = require('./models/codeModel');

//Get routers
const routes = require('./routes/index'),
    userRouter = require('./routes/users')(User, Client, upload),
    clientRouter = require('./routes/clients')(User, Client),
    apiRouter = require('./routes/api')(User, Client, Code, Token);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Initialize passport and strategies
require('./config/passport')(app, User, Token, Client);

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Сustom middleware
 * Add method {isAuthenticated} to res.locals
 * gives opportunity to use it in views
 */
app.use(function (req, res, next) {
    res.locals = {
        isAuthenticated: () => {
            return req.isAuthenticated() != null ? req.isAuthenticated() : null;
        }
    };
    next();
});

// Register routers
app.use('/clients', clientRouter);
app.use('/api', apiRouter);
app.use('/', routes);
app.use('/', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
