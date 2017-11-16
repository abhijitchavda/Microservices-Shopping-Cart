var passport = require('passport');
var User = require('../models/user');
var LocalStatergy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
   done(null,user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err,user);
    })
});
