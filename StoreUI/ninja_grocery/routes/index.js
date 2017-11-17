var express = require('express');
var router = express.Router();
var Request=require('request');
var product;
var catagori;
var productChunks=[];
/* GET home page. */
router.get('/', function(req, res, next) {
	Request.get('http://10.0.0.183:8000/mostfav', function (error, response, body) {
 	            if (error) {
                throw error;
            }
 
            data = JSON.parse(body);
            product=data;
            productChunks=[];
            var chunkSize=3;
            for(var i=0;i< product.length;i +=chunkSize){
            	productChunks.push(product.slice(i,i+chunkSize));
            }
            res.render('shop/index', { title: 'ninja product catalog',products: productChunks});
});
  
});

router.get('/catagory/:catagory', function(req, res, next) {
      var cat=req.params.catagory;
      catagori=cat;
      Request.get('http://10.0.0.183:8000/catagory/'+cat, function (error, response, body) {
                if (error) {
                throw error;
            }
 
            data = JSON.parse(body);
            product=data;
            productChunks=[];
            var chunkSize=3;
            for(var i=0;i< product.length;i +=chunkSize){
                  productChunks.push(product.slice(i,i+chunkSize));
            }
            res.render('shop/index', { title: 'ninja product catalog',products: productChunks});
});
  
});

router.get('/catagory/sort/:variant/:type', function(req, res, next) {
      var variant=req.params.variant;
      var type=req.params.type;
      Request.get('http://10.0.0.183:8000/catagory/'+catagori+'/sort/'+variant+'/'+type, function (error, response, body) {
                 if (error) {
                throw error;
            }
 
            data = JSON.parse(body);
            product=data;
            productChunks=[];
            var chunkSize=3;
            for(var i=0;i< product.length;i +=chunkSize){
                  productChunks.push(product.slice(i,i+chunkSize));
            }
            res.render('shop/index', { title: 'ninja product catalog',products: productChunks});
});
  
});

router.post("/addtocart/:id",function(request, response, next){
var it=request.params.id;
console.log(it);
//SEND THE PRODUCT TO CART AND MODIFY THE STATUS
response.json({"status":false});
});

router.get("/payment",function(request, response, next){
console.log("Success");
});

module.exports = router;
