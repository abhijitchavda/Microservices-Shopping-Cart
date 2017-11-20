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
//console.log(it);

Request.get('http://10.0.0.183:8000/product/'+it, function (error, res, body) {
                 if (error) {
                throw error;
            }

         data = JSON.parse(body);
         console.log(data);

         
         response.json({"status":true});

  });

//form: {'longURL': url}
//SEND THE PRODUCT TO CART AND MODIFY THE STATUS
});
var isSend="";
router.get("/addproductsadmin",function(request, response, next){
response.render('shop/adminprod', { title: 'ninja product catalog',stat: isSend});
});

router.post("/submitproduct",function(request,response,next){
var name=request.body.name;
var des=request.body.des;
var price=request.body.price;
var cat=request.body.cat;
var rating=request.body.rat;
var img=request.body.image;

console.log(name,des,price,cat,rating,img);


var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request
var options = {
    url: 'http://10.0.0.183:8000/addproduct',
    method: 'POST',
    headers: headers,
    form: {'name': name,'des':des,'price':price,'cat':cat,'rating':rating,'img':img}
}

// Start the request
Request(options, function (error, resp, body) {
     if (error) {
                throw error;
            }
            
            var data = JSON.parse(body);
            if(data.code==200){
            //console.log(data.code);
            isSend="item inserted"
            response.redirect("/productcatalog/addproductsadmin");
            response.end();
          }
          else if(data.code==400){
            isSend="item already exist";
            response.redirect("/productcatalog/addproductsadmin");
            response.end(); 
          }
          else if(data.code==404){
            isSend="fill up all the items";
            response.redirect("/productcatalog/addproductsadmin");
            response.end(); 
          }
          else{
            isSend="unable to insert try again!";
            response.redirect("/productcatalog/addproductsadmin");
            response.end();
            
          }
            
})



});
router.get("/payment",function(request, response, next){
console.log("Success");
});

module.exports = router;
