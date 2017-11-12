var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var avro = require('avsc');

var kafka = require('kafka-node')
var Producer = kafka.Producer
var HighLevelProducer = kafka.HighLevelProducer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
// instantiate client with as connectstring host:port for  the ZooKeeper for the Kafka cluster
var client = new Client('localhost:2181', 'my-client-id2', {
  sessionTimeout: 300,
  spinDelay: 100,
  retries: 2
});

// name of the topic to produce to
var signuptopic = "signup_response",
    //signintopic = "signin_request",
    //signouttopic = "signout_request",
    activitytopic = "loggedusers"
    KeyedMessage = kafka.KeyedMessage,
    producer = new Producer(client),
    km = new KeyedMessage('key', 'message'),
    signuptopicProducerReady = false,
    //signintopicProducerReady = false,
    //signouttopicProducerReady = false;
    activitytopicProducerReady = false;


producer.on('ready', function () {
    console.log("Producers for all topics are ready");
    signuptopicProducerReady = true;
    //signintopicProducerReady = true;
    //signouttopicProducerReady = true;
    activitytopicProducerReady = true;
});

producer.on('error', function (err) {
  console.error("Problem with producing Kafka message "+err);
})


var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.post('/login',
  passport.authenticate('local', {failureRedirect:'/users/login', failureFlash:'Invalid username or password'}),
  function(req, res) {
    //req.session.user = user;
    req.flash('success', 'You are now logged in');
    res.redirect('/');

    //log events to kafka topic.
    //var uname = "User: "+req.body.username+" has logged in at " + Date.now();
    var uname = `User: ${req.body.username} has logged in at ${Date.now()}`;
    //var uname = "User with session " +req.sessionID+ " has logged in at " + Date.now();
    produceSigninrequest(uname);
  });

  function produceSigninrequest(userdata){
    payloads = [
      { topic: activitytopic, messages: userdata, partition: 0, timestamp: Date.now() },
    ];
  if (activitytopicProducerReady) {
  producer.send(payloads, function (err, data) {
      console.log(data);
  });
  } else {
      // the exception handling can be improved, for example schedule this message to be tried again later on
      console.error("sorry, activitytopicProducerReady is not ready yet, failed to produce message to Kafka.");
  }
  }


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else{
        return done(null, false, {message:'Invalid Password'});
      }
    })
  });
}));


router.post('/register', function(req, res, next) {
  //console.log(req.body.name);
  //console.log(req.body.email);

  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  //console.log(name);
  //console.log(email);

  //form validation
  req.checkBody('name', 'Name is a required field').notEmpty();
  req.checkBody('email', 'Please enter your email address').notEmpty();
  req.checkBody('email', 'Please enter valid email address').isEmail();
  req.checkBody('username', 'Username is a required field').notEmpty();
  req.checkBody('password', 'Password is required field').notEmpty();
  req.checkBody('password2', 'the passwords must match').equals(req.body.password);


  //errors
  var errors = req.validationErrors();

  if(errors){
    //console.log('errors')
    res.render('register' , {errors: errors});
  }else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(JSON.stringify(user));
      console.log('created user');
      produceSignupresponse(JSON.stringify(user));  //log the this event to kafka topic.
    });

    function produceSignupresponse(userdb){
      payloads = [
        { topic: signuptopic, messages: userdb, partition: 0, timestamp: Date.now() },
    ];
    if (signuptopicProducerReady) {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
    } else {
        // the exception handling can be improved, for example schedule this message to be tried again later on
        console.error("sorry, signuptopicProducerReady is not ready yet, failed to produce message to Kafka.");
    }
    }


    req.flash('success', 'You are now registered. Please login again.')
    res.location('/');
    res.redirect('/');



  }//end of else block


});


router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/users/login');

  //post it.
  //console.log(req.session.user);
  //console.log(req.sessionID);

  //var uname =  "User: "+res.locals.user+" with sessionID "+req.sessionID+" has logged out at " + Date.now();
  var uname = "User: "+res.locals.user.name+" has logged out at " +Date.now();
  produceSignoutrequest(uname);

});

function produceSignoutrequest(userdata){
  payloads = [
    { topic: activitytopic, messages: userdata, partition: 0, timestamp: Date.now() },
  ];
if (activitytopicProducerReady) {
producer.send(payloads, function (err, data) {
    console.log(data);
});
} else {
    // the exception handling can be improved, for example schedule this message to be tried again later on
    console.error("sorry, activitytopicProducerReady is not ready yet, failed to produce message to Kafka.");
}
}



module.exports = router;
