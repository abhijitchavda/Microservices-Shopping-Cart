var express = require('express');
var router = express.Router();
var request=require('request');

var serverippc = "localhost";
var serverportpc = "9000";
var productChunks = [];
var quantity = 0;
var price = 0;

router.get('/', function(req, res, next) {

    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    };

// Configure the request
    var options = {
        url: 'http://localhost:9000/getusercartdetails',
        method: 'POST',
        headers: headers,
        form: {"customer_id":"niralkk"}
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
                total_price : quantity, total_quantity: price,
                products: productChunks, layout:'shoppingcart'});
        }
    });
});

module.exports = router;