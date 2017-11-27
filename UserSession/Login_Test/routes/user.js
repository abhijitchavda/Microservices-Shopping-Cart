var express = require('express');
var router = express.Router();
//var csrf = require('csurf');
var passport = require('passport');
var flash = require('connect-flash');


//var csrfProtection = csrf();
//router.use(csrfProtection);

var winston = require('winston');
require('winston-mongodb').MongoDB;
const reqLogger = new (winston.Logger)({
    transports: [
        new(winston.transports.MongoDB)({
            db : 'mongodb://localhost:27017/logSystem',
            collection: 'useractivitylogs',
            //level:'info'
            // expireAfterSeconds: 2;
        })
    ],
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/profile',isLoggedIn, function(req,res,next){

    res.render('user/profile');
});

router.get('/logout', isLoggedIn, function(req, res, next){
    req.logOut();
    res.render('user/signin');
});

router.use('/',notLoggedIn, function (req,res,next) {
   next();
});

router.get('/signup', function(req,res,next){
    var messages = req.flash('error');
    console.log(messages);
    res.render('user/signup',{messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup',{
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));


router.get('/signin', function(req,res,next){
    var messages = req.flash('error');
    console.log(messages);
    res.render('user/signin',{messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin',{
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(request, response) {
        //req.flash('success', 'You are now logged in');
        //console.log(request);
        //console.log(response);
        //console.log(request.user.email);
        reqLogger.info(`${request.body.email} has logged in`,{
            httpRequest:{
                status: response.statusCode,
                requestUrl: request.url,
                requestMethod: request.method,
                remoteIp: request.connection.remoteAddress,
            }
        });
        response.redirect('/user/profile');
        //adding logs to db.
    }
);

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/')
}

function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.render('user/signin');
}

module.exports = router;
