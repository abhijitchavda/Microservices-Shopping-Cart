var express = require('express');
var router = express.Router();
var Request=require('request');
var product;
var catagori;
/* GET home page. */
router.get('/', function(req, res, next) {
	Request.get('http://10.0.0.183:8000/mostfav', function (error, response, body) {
 	           if (error) {
                throw error;
            }
 
            data = JSON.parse(body);
            product=data;
            var productChunks=[];
            var chunkSize=3;
            for(var i=0;i< product.length;i +=chunkSize){
            	productChunks.push(product.slice(i,i+chunkSize));
            }
            res.render('shop/index', { title: 'ninja product catalog',products: productChunks});
});
  
});

module.exports = router;
