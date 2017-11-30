
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var winston = require('winston');
require('winston-mongodb').MongoDB;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var Request=require('request');
var mongoose = require('mongoose');
var validator = require('express-validator');
var mongoStore = require('connect-mongo')(session);

mongoose.connect('54.241.134.246:27017, 54.183.129.56:27018, 54.183.244.236:27019/users?replicaSet=prathmesh-replica-set');
//mongoose.connect('54.241.134.246:27017/users');
var userRoutes = require('./routes/user')
require('./config/passport');


var productcatalog = require('./routes/index');
//var user = require('./routes/user');
//var payment = require('./routes/payment');
var checkout = require('./routes/checkout');
var order = require('./routes/orders');
var shoppingcart = require('./routes/shoppingcart');

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

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

app.use(function (request, response, next) {
   response.locals.login = request.isAuthenticated();
   response.locals.session  = request.session;
   //console.log(res.locals.session);
   next();
});

app.use('/productcatalog', productcatalog);
app.use('/user', userRoutes);
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
