var express = require('express');
var router = express.Router();
var Request=require('request');

router.get('/', function(req, res, next) {
    console.log('Entered shopping cart');
    res.render('shop/shoppingcart', { title: 'Shopping Cart',layout:'shoppingcart'});
});

module.exports = router;