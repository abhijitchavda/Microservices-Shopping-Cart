var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var murl = "mongodb://13.59.15.159:27017,13.59.134.250:27017,52.14.77.142:27017/catalog?replicaSet=abhijit";
var http = require("http");
var constantm=require('./constants');
var url = require('url');
var express=require("express");
var app=express();
var ObjectID = require('mongodb').ObjectID
var ip=require('ip');

var path = require('path');
app.use(express.static(path.resolve('./public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/mostfav', function (request, response, next) {
    response.setHeader("Content-Type","application/json");
    MongoClient.connect(murl, function(err, db) {  //get famous item for home page
        assert.equal(null, err);
        db.collection("catalogitems").find().sort({avg_ratings:-1}).limit(constantm.limitvalue).toArray(function(err, result) {
            if (err) throw err;
            //console.dir('http://'+ip.address()+':3000/mostfav');
            console.dir('http://'+request.ip+':3000/mostfav');
            for (i=0;i<result.length;i++){
                result[i].img="http://"+constantm.ip+":"+constantm.port+result[i].img;
            }
            response.json(result);
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
                result[i].img="http://"+constantm.ip+":"+constantm.port+result[i].img;
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
                    result[i].img="http://"+constantm.ip+":"+constantm.port+result[i].img;
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
                    result[i].img="http://"+constantm.ip+":"+constantm.port+result[i].img;
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
                result[i].img="http://"+constantm.ip+":"+constantm.port+result[i].img;
            }
            response.json(result);
            response.end();
        });
        db.close()
    });
});

app.get('/product', function (request, response, next) {
    var id=new ObjectID(request.query.id);
    response.setHeader("Content-Type","application/json");
    MongoClient.connect(murl, function(err, db) {  //get product details
        assert.equal(null, err);
        db.collection("catalogitems").find({_id:id}).toArray(function(err, result) {
            if (err) throw err;
            for (i=0;i<result.length;i++){
                result[i].img="http://"+constantm.ip+":"+constantm.port+result[i].img;
            }
            response.json(result);
            response.end();
        });
        db.close()
    });

});


app.listen(constantm.port)
