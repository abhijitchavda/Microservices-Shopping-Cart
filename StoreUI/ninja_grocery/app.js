
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var winston = require('winston');
require('winston-mongodb').MongoDB;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var Request=require('request');
var flash = require('connect-flash');

var productcatalog = require('./routes/index');
var user = require('./routes/user');
//var payment = require('./routes/payment');
var checkout = require('./routes/checkout');
var order = require('./routes/orders');
var shoppingcart = require('./routes/shoppingcart');

//User Sessions
var session = require('express-session');
var passport = require('passport');
var validator = require('express-validator');
var mongoStore = require('connect-mongo')(session);

var app = express();

var userRoutes = require('./routes/user')
require('./config/passport');
// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 10 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session  = req.session;
    console.log(res.locals.session);
    next();
});

app.use('/user', userRoutes);
app.use('/', routes);

app.use('/productcatalog', productcatalog);
app.use('/user', user);
//app.use('/payment', payment);
app.use('/orders', order);
app.use('/shoppingcart',shoppingcart);
//app.use('/payment/checkout',payment);
app.use('/checkout',checkout);
app.use('/checkout/success', checkout);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
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
