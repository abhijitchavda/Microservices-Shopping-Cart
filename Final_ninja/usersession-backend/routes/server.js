var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//mongoose.connect('localhost:27017/shopping');
mongoose.connect('54.241.134.246:27017, 54.183.129.56:27018, 54.183.244.236:27019/users?replicaSet=prathmesh-replica-set');
//mongoose.connect('localhost:27017,localhost:27018,localhost:27019/ninja?replicaSet=shopping');
//mongoose.connect('13.56.179.55:27017, 13.57.12.172:27018, 52.53.176.18:27019/ninja?replicaSet=shopping');

var Schema = mongoose.Schema;
var user = require('../models/user')
//var user = mongoose.model('user');

router.get('/', function(req, res, next) {
    res.status(200).render('index');
});


router.get('/ping', function(req, res, next) {
    res.status(200).json({'Application Name' : 'Shopping Cart API', status : "true", code : "200" });
});

router.post('/getLogin', function(req, res, next) {
    user.findOne({'email': req.body.email},function(err,user){
        if(err){
            return res.status(500).json({"Message" :"Not Found", status:"false",code:"500"});
        }
        if(!user){
            return res.status(500).json({"Message" :"User Not Found", status:"false",code:"500"});

        }
        if(req.body.password!=user.password){
            return res.status(500).json({"Message" :"Incorrect password", status:"false",code:"500"});
        }
        req.session.userId = user._id;
        return res.status(200).json({id :user._id, status:"true",code:"200"});
    });

});

router.post('/getSignUp', function(req, res, next) {

    console.log(req.session);
    if(req.body.email && req.body.password){

        var userData = {
            email: req.body.email,
            password: req.body.password
        }
        user.create(userData, function (err, user) {
            if (err) {
                return next(err)
            } else {
                req.session.userid = user._id;
                console.log(user._id);
                console.log(req.session.userid);
                return res.status(200).json({id :user._id, status:"true",code:"200"});
            }
        });
    }

});

router.post('/getEmail',function(req,res,next){
    var userid = req.body._id;
    console.log("@@@" + userid);
    /*var myObj =
        { _id: req.body._id};*/
var id = mongoose.Types.ObjectId(userid);
    console.log(id);
    user.findOne( {_id: userid} ,function(err, user){
        if(err){
            return res.status(500).json({"Message" :"Incorrect password", status:"false",code:"500"});
        }
        console.log(user);
        return res.status(200).json({email :user.email, status:"true",code:"200"});
    });

});

router.post('/getUserId',function(req,res,next){
    var email = req.body.email;
    console.log(email);

    user.findOne({'email': email},function(err, user){
        if(err){
            return res.status(500).json({"Message" :"Incorrect password", status:"false",code:"500"});
        }
        console.log(user);
        return res.status(200).json({id :user._id, status:"true",code:"200"});
    });

});

router.get('/getallcartitem', function(req, res, next) {
    Cart.find()
        .then(function(cartItems) {
            //res.render('index', {items: doc});
            res.status(200).json({items: cartItems, status : "true", code : "200" });
        });
});



module.exports = router;
