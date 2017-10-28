var MongoClient = require('mongodb').MongoClient
			, assert = require('assert');
var murl = "mongodb://localhost:27017,localhost:27018,localhost:27019/catalog?replicaSet=abhijit";
var http = require("http");
var constantm=require('./constants');
var url = require('url');
var express=require("express");
var app=express();
var ObjectID = require('mongodb').ObjectID

app.get('/mostfav', function (request, response, next) {
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {                  //get famous item for home page
  			assert.equal(null, err);
  			db.collection("catalogitems").find().sort({avg_ratings:-1}).limit(constantm.limitvalue).toArray(function(err, result) {
    		if (err) throw err;
    		response.json(result);
    		response.end();
			});
			db.close()
		});  	
});

app.get('/catagory/:catagory', function (request, response, next) {
			var cat=request.params.catagory;
			response.setHeader("Content-Type","application/json");
			MongoClient.connect(murl, function(err, db) {                //get content for perticular catagory
  			assert.equal(null, err);
  			db.collection("catalogitems").find({"catagory":cat}).toArray(function(err, result) {
    		if (err) throw err;
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
			MongoClient.connect(murl, function(err, db) {                 //sort based on price,avg_ratings and hightolow and lowtohigh
  			assert.equal(null, err);
  			if (request.params.type=="hightolow")
  			{
  				db.collection("catalogitems").find({"catagory":cat}).sort(bsort).toArray(function(err, result) {
    			if (err) throw err;
    			response.json(result);
    			response.end();
  				});  
  			}
  			if (request.params.type=="lowtohigh")
  			{
  				db.collection("catalogitems").find({"catagory":cat}).sort(asort).toArray(function(err, result) {
    			if (err) throw err;
    			response.json(result);
    			response.end();
  				});  
  			}
  			db.close()
		});
});

app.listen(3000)
