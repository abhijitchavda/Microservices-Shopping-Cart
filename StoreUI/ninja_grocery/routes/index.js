var express = require('express');
var router = express.Router();
var Request=require('request');
var constm=require('../public/javascripts/constants.js');
var serverippc = constm.server_ip_pc;
var serverportpc=constm.server_port_pc;

var serveripsc = constm.server_ip_sc;
var serverportsc = constm.server_port_sc;

var passport = require('passport');
var userid;
var product;
var catagori;
var flag=0;
var productChunks=[];
/* GET home page. */

<<<<<<< HEAD
router.get('/:cid',function(req,res,next){
=======
router.get('/groupshare/:cid',function(req,res,next){
>>>>>>> 3bf8d2d7909dbec983e00d3f1a1186014b522105

userid=req.params.cid;
flag=1;
console.log("cid passes by params"+req.params.cid);
res.redirect('/productcatalog');
});




router.get('/',isLoggedIn, function(req, res, next) {
    //console.log("#######"+req.session.passport.user);
    Request.get('http://'+serverippc+':'+serverportpc+'/mostfav', function (error, response, body) {
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
        res.render('shop/index', { title: 'ninja product catalog',products: productChunks,layout:'productCatalogue'});
    });

});

router.get('/catagory/:catagory',isLoggedIn, function(req, res, next) {
    var cat=req.params.catagory;
    catagori=cat;
    Request.get('http://'+serverippc+':'+serverportpc+'/catagory/'+cat, function (error, response, body) {
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
        res.render('shop/index', { title: 'ninja product catalog',products: productChunks,layout:"productCatalogue"});
    });

});

router.get('/catagory/sort/:variant/:type',isLoggedIn, function(req, res, next) {
    var variant=req.params.variant;
    var type=req.params.type;
    Request.get('http://'+serverippc+':'+serverportpc+'/catagory/'+catagori+'/sort/'+variant+'/'+type, function (error, response, body) {
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
        res.render('shop/index', { title: 'ninja product catalog',products: productChunks,layout:'productCatalogue'});
    });

});


router.get('/addtocart/:cid',isLoggedIn,function(req, res, next){
   var it=req.params.cid;
   var c_id;
   //var c_id=req.session.passport.user;
   //var c_id=request.session.passport.user;
   //console.log("this is the uid---->"+cid);
<<<<<<< HEAD
    if(req.session.passport.user){
=======
    if(flag == 0){
>>>>>>> 3bf8d2d7909dbec983e00d3f1a1186014b522105
    c_id=req.session.passport.user;    
    }
    else if(flag==1){
    c_id=userid;
    }


    Request.get('http://'+serverippc+':'+serverportpc+'/product/'+it, function (error, response, body) {
        if (error) {
            throw error;
        }

        data = JSON.parse(body);
        var headers = {
            'User-Agent':       'Super Agent/0.0.1',
            'Content-Type':     'application/x-www-form-urlencoded'
        };


// Configure the request
        console.log("The user is:"+c_id);
        var options = {
            url: 'http://'+serveripsc+':'+serverportsc+'/additemtocart',//add shopping cart serverip
            method: 'POST',
            headers: headers,
            form: {'customer_id':c_id,'product_id': data[0]._id,
                'name': data[0].name,'des': data[0].description,'price':data[0].price,
                'cat':data[0].catagory,'rating':data[0].avg_ratings,'img':data[0].img}
        }



        console.log("form"+ JSON.stringify(options.form));
// Start the request
        Request(options, function (error, resp, bod) {
            console.log(bod);
            if (error) {
                console.log("Error!!"+error);
                throw error;
            }

            var data = JSON.parse(bod);

            if(data.code=="200"){
                console.log("200");
                res.redirect('/productcatalog'); 
            }


        });
    });

//form: {'longURL': url}
//SEND THE PRODUCT TO CART AND MODIFY THE STATUS
});


var isSend="";
router.get("/addproductsadmin",isLoggedIn,function(request, response, next){
    response.render('shop/adminprod', { title: 'ninja product catalog',stat: isSend});
});

router.post("/submitproduct",isLoggedIn,function(request,response,next){
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
        url: 'http://'+serverippc+':'+serverportpc+'/addproduct',
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

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()||flag==1){
        return next();
    }
    res.redirect('/user/signin')
}

module.exports = router;
