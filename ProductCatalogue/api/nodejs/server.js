var MongoClient = require('mongodb').MongoClient
			, assert = require('assert');
var murl = "mongodb://localhost:27017/catalog";
//var murl = "mongodb://localhost:27017,localhost:27018,localhost:27019/catalog?replicaSet=abhijit";
//var murl = "mongodb://18.217.14.61:27017,18.221.170.100:27018,18.216.89.104:27019/catalog?replicaSet=abhijit";
var http = require("http");
var constantm=require('./constants');
var url = require('url');
var express=require("express");
var app=express();
var ObjectID = require('mongodb').ObjectID
var ip=require('ip');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var path = require('path');
app.use(express.static(path.resolve('./public')));
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
});

app.get('/',function(request,response,next){
response.status(200);
response.send("pinging");
});

app.get('/mostfav', function (request, response, next) {
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {  //get famous item for home page
  			assert.equal(null, err);
  			db.collection("catalogitems").find().sort({avg_ratings:-1}).toArray(function(err, result) {
    		if (err) throw err;
    		//console.dir('http://'+ip.address()+':3000/mostfav');
console.dir('http://'+request.ip+':3000/mostfav');
    		for (i=0;i<result.length;i++){
    			result[i].img="http://"+ip.address()+":"+constantm.port+result[i].img;
    		}
    		response.send(result);
    		response.end();
			});
			db.close()
		});  	
});

app.get('/catagory/:catagory', function (request, response, next) {
			var cat=request.params.catagory;
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {  //get content for perticular catagory
  			assert.equal(null, err);
  			db.collection("catalogitems").find({"catagory":cat}).toArray(function(err, result) {
    		if (err) throw err;
    		for (i=0;i<result.length;i++){
    			result[i].img="http://"+ip.address()+":"+constantm.port+result[i].img;
    		}
    		response.json(result);
    		response.end();
			});
			db.close()
		});
});
app.get('/catagory/:catagory/sort/:variant/:type', function (request, response, next) {
			var cat=request.params.catagory;
			var variant=request.params.variant;
			var asort = {};
  			asort[variant] = 1;
  			var bsort = {};
  			bsort[variant] = -1;
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {  //sort based on price,avg_ratings and hightolow and lowtohigh
  			assert.equal(null, err);
  			if (request.params.type=="hightolow")
  			{
  				db.collection("catalogitems").find({"catagory":cat}).sort(bsort).toArray(function(err, result) {
    			if (err) throw err;
    			for (i=0;i<result.length;i++){
    			result[i].img="http://"+ip.address()+":"+constantm.port+result[i].img;
    		}
    			response.json(result);
    			response.end();
  				});  
  			}
  			if (request.params.type=="lowtohigh")
  			{
  				db.collection("catalogitems").find({"catagory":cat}).sort(asort).toArray(function(err, result) {
    			if (err) throw err;
    			for (i=0;i<result.length;i++){
    			result[i].img="http://"+ip.address()+":"+constantm.port+result[i].img;
    		}
    			response.json(result);
    			response.end();
  				});  
  			}
  			db.close()
		});
});

app.get('/catagory/:catagory/filter/price', function (request, response, next) {
			var cat=request.params.catagory;
			var upperl=parseInt(request.query.ul);
			var lowerl=parseInt(request.query.ll);
			var query = {
							catagory: cat,
    						price: {$gt:lowerl,$lt:upperl}
						};
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {  //filter based on price with min and max value
  			assert.equal(null, err);
			db.collection("catalogitems").find(query).sort({price:1}).toArray(function(err, result) {
    		if (err) throw err;
    		for (i=0;i<result.length;i++){
    			result[i].img="http://"+ip.address()+":"+constantm.port+result[i].img;
    		}
    		response.json(result);
    		response.end();
  			});
  			db.close()
		});
});

app.get('/product/:id', function (request, response, next) {
			var id=new ObjectID(request.params.id);
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {  //get product details
  			assert.equal(null, err);
			db.collection("catalogitems").find({_id:id}).toArray(function(err, result) {
    		if (err) throw err;
    		for (i=0;i<result.length;i++){
    			result[i].img="http://"+ip.address()+":"+constantm.port+result[i].img;
    		}
    		response.json(result);
    		response.end();
  			});  
			db.close()
		});  			

});	


app.post('/addproduct',function(request,response,next){
      var prodname=request.body.name;
      var proddes=request.body.des;
      var prodprice=parseInt(request.body.price);
      var prodcat=request.body.cat;
      var prodrat=parseInt(request.body.rating);
      var prodimg=request.body.img;
      if(prodname.length!=0&&proddes.length!=0&&prodimg.length!=0){
      MongoClient.connect(murl, function(err, db) {  //get product details
            assert.equal(null, err);
            db.collection("catalogitems").find({"name":prodname,"catagory":prodcat},{name:1}).toArray(function(err, res) {
            if (err) throw err;
              if (res.length==0) {

                    db.collection("catalogitems").insert({"name":prodname,"description":proddes,"price":prodprice,"catagory":prodcat,"avg_ratings":prodrat,"img":prodimg},function(err, resul) {
                                        assert.equal(err, null);
                                              if(resul.result.ok==1)
                                              {
                                              response.json({"code":200,"msg":"inserted"});
                                              response.end();
                                              db.close();
                                            }
                                        });
              }
              else{
                
                  response.json({"code":400,"msg":"item already exist"})
                  response.end();
                  db.close();
              }
              
        });  

    });
//console.log(prodname,proddes,prodprice,prodcat,prodrat,prodimg);
//response.end();
}
else{
  response.json({"code":404,"msg":"fill up"})
                  response.end();
}
});

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);

});



app.listen(constantm.port)

/*
{"name" : "snickers",
 "description" : "full of chocolate and nuts", 
 "price" : 5, 
 "catagory" : "bars", 
 "avg_ratings" : 5, 
 "img" : "/snickers.png" 
 }
 */
