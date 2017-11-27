var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27015/ninja');
var Schema = mongoose.Schema;
var Admin = require('../models/Admin')
/*

var userDataSchema = new Schema({
  title: {type: String, required: true},
  content: String,
  author: String
}, {collection: 'user-data'});
*/

//var UserData = mongoose.model('UserData', userDataSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/getAdmin', function(req, res, next) {
    Admin.find()
      .then(function(doc) {
        res.render('index', {items: doc});
      });
});

router.post('/insertAdmin', function(req, res, next) {
  var item = {
      firstname: req.body.fname,
      lastname: req.body.lname,
  };

  var data = new Admin(item);
  data.save();

  res.redirect('/');
});

router.post('/updateAdmin', function(req, res, next) {
  var id = req.body.id;

    Admin.findById(id, function(err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
    doc.firstname = req.body.fname;
    doc.lastname = req.body.lname;
    doc.save();
  })
  res.redirect('/');
});

router.post('/deleteAdmin', function(req, res, next) {
  var id = req.body.id;
    Admin.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
