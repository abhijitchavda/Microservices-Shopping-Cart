var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {

    //Check cart session and if not exists, redirect to prduct catalogue

    //Obtain total from shopping cart cart.total from new Cart object
    //var errMsg = req.flash("error")[0];
    errMsg = "";
    res.render('shop/checkout', { title: 'Checkout',layout: 'checkout',total:'100', 'errMsg':errMsg, 'noError':!errMsg});
});


router.post('/', function(req,res, next){
  console.log(res.body);
	// Check for session


  // Create cart object
  var stripe = require("stripe")("sk_test_LvSqqsFzgTYd7MWfwjNTL4Un");
  stripe.charges.create({
          amount: 20000, //cart.price * 100
          currency: "usd",
          source: req.body.stripeToken, // obtained with Stripe.js
          description: "Charge for Ninja Cart"
    }, function(err, charge) {
            if(err){
            	console.log('Payment failed');
              //Redirect to checkout page
            }
            console.log('Payment successful');
            //Clear cart

            //Write payment to DB

            var paymentObject = {"OrderId" : "1234",  "CustomerId" : "John",   "Total" : 100.50, "Timestamp" : "20170202"};

            var options = {
                  // Add AWS URI
                  uri: 'http://localhost:5000/payment',
                  method: 'POST',
                  json: paymentObject
            };

            request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                          console.log("Wrote Payment to DB!");
                        }
            });

            //Write order to DB

            //Generate OrderID
              var orderObject = {
                    "OrderId" : "1234",   
                    "CustomerId" : "John",   
                    "ItemDetails" : {"Bananas":{"Qty":2,"Price":1.5},"Nachos":{"Qty":1,"Price":4.4}},
                    "Total" : 32.5, 
                    "Status" : "Order Placed",  
                    "Timestamp" : "20170202", 
                    "DeliveryAddress" : "#1 Washington Sq, San Jose, CA 95112"
            }

            var options = {
                  // Add AWS URI
                  uri: 'http://localhost:4000/order',
                  method: 'POST',
                  json: orderObject
            };

            request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                          console.log("Wrote Order to DB!");
                        }
            });


            //Redirect to success page
            res.redirect('/checkout/success');
    });
});

router.get('/success', function(req, res, next) {

    //Check cart session and if not exists, redirect to prduct catalogue

    //Obtain total from shopping cart cart.total from new Cart object
    
    res.render('shop/success');
});

module.exports = router;
