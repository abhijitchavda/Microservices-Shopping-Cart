var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('shop/payment', { title: 'Payment'});
    res.send('respond with a payment resource');
});

module.exports = router;
