var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
const uuidv4 = require('uuid/v4');
var passport = require('passport');
var const_file=require('../public/javascripts/constants.js');
var payment_endpoint = const_file.payment_api_endpoint
var order_endpoint = const_file.order_api_endpoint
/* GET users listing. */
router.get('/',isLoggedIn, function(req, res, next) {
    errMsg = "";
    //Check cart session and if not exists, redirect to prduct catalogue

    //Obtain total from shopping cart cart.total from new Cart object
    var options = {
                  // Add AWS URI
                  uri: 'http://localhost:9000/getusercart',
                  method: 'POST',
                  json: {"customer_id" : req.session.passport.user} //Non existent user not handled
            };

            request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            total = body['usercart']['Total'];
                            console.log("*Obtained total from Shopping cart DB: "+total);
                            console.log("\n*Rendering checkout page ");
                            res.render('shop/checkout', { title: 'Checkout',layout: 'checkout',total:total, 'errMsg':errMsg, 'noError':!errMsg});
                        }
                        else{
                          console.log(error)
                        }
            });

    //var errMsg = req.flash("error")[0];
    
    //res.render('shop/checkout', { title: 'Checkout',layout: 'checkout',total:total, 'errMsg':errMsg, 'noError':!errMsg});
});


router.post('/', isLoggedIn, function(req,res, next){
	
  // Check for session



  //Generate OrderID

  orderId = uuidv4();
  console.log("*OrderId generated: "+orderId);


  // Create cart object
  var stripe = require("stripe")("sk_test_LvSqqsFzgTYd7MWfwjNTL4Un");
  stripe.charges.create({
          amount: req.body.total * 100, //cart.price * 100
          currency: "usd",
          source: req.body.stripeToken, // obtained with Stripe.js
          description: "Charge for Ninja Cart"
    }, function(err, charge) {
            //console.log(charge)
            if(err){
            	console.log('*Payment failed');
              //Redirect to checkout page

            }
            console.log('*Payment successful');

            var address = req.body.address;

            //Write payment to DB

            var paymentObject = {"OrderId" : orderId,  "CustomerId" : req.session.passport.user,   "Total" : parseFloat(req.body.total), "Timestamp" : moment().format('YYYY-MM-DD HH:mm:ss Z')};
            console.log('*Payment object created: \n'+JSON.stringify(paymentObject));
            var options = {
                  // Add AWS URI
                  uri: payment_endpoint,//'http://localhost:5000/payment',
                  method: 'POST',
                  json: paymentObject
            };

            request(options, function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                          console.log("*Wrote Payment to DB!");
                        }
            });


            // Get order for the user from Shopping Cart
             var options = {
                  // Add AWS URI
                  uri: 'http://localhost:9000/getusercart',
                  method: 'POST',
                  json: {"customer_id" : req.session.passport.user} //Non existent user not handled
            };

            request(options, function (error, response, body) {

                        if (!error && response.statusCode == 200) {


                          
                          var items = {};
                          for(var i=0;i<body['usercart']['ItemDetails'].length;i+=1){
                                items[body['usercart']['ItemDetails'][i]['product_name']]={'Qty':body['usercart']['ItemDetails'][i]['product_quantity'],'Price':parseFloat(body['usercart']['ItemDetails'][i]['product_price'])};
                          }
                          //console.log(body['usercart']);
                            var orderObject = {
                                    "OrderId" : orderId,   
                                    "CustomerId" : body['usercart']['CustomerId'],   
                                    "ItemDetails" : items,
                                    "Total" : body['usercart']['Total'], 
                                    "Status" : "Order Placed",  
                                    "Timestamp" : moment().format('YYYY-MM-DD HH:mm:ss Z'), 
                                    "DeliveryAddress" : address
                            };
                    

                            console.log("*OrderObject created:\n"+JSON.stringify(orderObject));

                           var options = {
                                  // Add AWS URI
                                  uri: order_endpoint,//'http://localhost:4000/order',
                                  method: 'POST',
                                  json: orderObject
                            };

                            request(options, function (error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                          console.log("*Wrote Order to DB!");
                                        }
                            });

                            var options = {
                                      // Add AWS URI
                                      uri: 'http://localhost:9000/removeusercart',
                                      method: 'POST',
                                      json: {"customer_id":req.session.passport.user}
                                };

                                //Clear cart
                                request(options, function (error, response, body) {
                                            if (!error && response.statusCode == 200) {
                                              console.log("*Removed items from cart!");
                                            }
                                    //Redirect to success page
                                    res.redirect('/checkout/success');
                              });


                        }
                        else{
                          console.log(error)
                        }

            });
           
    });
});

router.get('/success', function(req, res, next) {

    //Check cart session and if not exists, redirect to prduct catalogue

    //Obtain total from shopping cart cart.total from new Cart object
    
    res.render('shop/success');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin')
}

module.exports = router;
