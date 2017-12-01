var express = require('express');
var router = express.Router();
var request=require('request');
var passport = require('passport');


//AWS EC2 Node Server--Shopping cart
var constm=require('../public/javascripts/constants.js');
var serveripsc = constm.server_ip_sc;
var serverportsc = constm.server_port_sc;

var productChunks = [];
var quantity = 0;
var price = 0;

router.get('/',isLoggedIn, function(req, res, next) {
    console.log("heekk");
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    };

    console.log("hsbd"+req.session.passport.user);
    var user = req.session.passport.user;

// Configure the request
    var options = {
        url: 'http://'+serveripsc+':'+serverportsc+'/getusercartdetails',
        method: 'POST',
        headers: headers,
        form: {"customer_id": user}
    };



// Start the request
    request(options, function (error, resp, body) {
        if (error) {
            throw error;
        }
        var data = JSON.parse(body);
        if(data.code==200){
            console.log("Data"+JSON.stringify(data.usercart));
            quantity = data.usercart.total_quantity;
            price = data.usercart.total_price;
            productChunks = data.usercart.products;

            res.render('shop/shoppingcart', { title: 'Ninja Shopping Cart',
                total_price : price , total_quantity: quantity,
                products: productChunks, layout:'shoppingcart'});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin')
}

module.exports = router;