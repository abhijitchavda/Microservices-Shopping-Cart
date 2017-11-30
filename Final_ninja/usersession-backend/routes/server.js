var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('54.241.134.246:27017, 54.183.129.56:27018, 54.183.244.236:27019/users?replicaSet=prathmesh-replica-set');
//mongoose.connect('localhost:27017,localhost:27018,localhost:27019/ninja?replicaSet=shopping');
//mongoose.connect('13.56.179.55:27017, 13.57.12.172:27018, 52.53.176.18:27019/ninja?replicaSet=shopping');

var Schema = mongoose.Schema;
var User = require('../models/user')


router.get('/', function(req, res, next) {
    res.status(200).render('index');
});


router.get('/ping', function(req, res, next) {
    res.status(200).json({'Application Name' : 'Shopping Cart API', status : "true", code : "200" });
});

router.post('/getLogin', function(req, res, next) {
    User.findOne({'email': req.body.email},function(err,user){
if(err){
    return res.status(500).json({"Message" :"Not Found", status:"false",code:"500"});
}
if(!user){
    return res.status(500).json({"Message" :"User Not Found", status:"false",code:"500"});

}
if(req.body.password!=user.password){
    return res.status(500).json({"Message" :"Incorrect password", status:"false",code:"500"});
}
    req.session.userId = user._id;
    return res.status(200).json({id :user._id, status:"true",code:"200"});
    });
    
});

router.post('/getSignUp', function(req, res, next) {

console.log(req.session);
    if(req.body.email && req.body.password){

    var userData = {
    email: req.body.email,
    password: req.body.password
  }
  User.create(userData, function (err, user) {
    if (err) {
      return next(err)
    } else {
        req.session.userid = user._id;
        console.log(user._id);
        console.log(req.session.userid);
      return res.status(200).json({id :user._id, status:"true",code:"200"});
    }
  });
    }
    
});

router.post('/getEmail',function(req,res,next){
var userid = req.body._id;
console.log(userid);

User.findOne({'_id': userid},function(err, user){
if(err){
    return res.status(500).json({"Message" :"Incorrect password", status:"false",code:"500"});
}
    console.log(user);
    return res.status(200).json({email :user.email, status:"true",code:"200"});
});

});

router.post('/getUserId',function(req,res,next){
var email = req.body.email;
console.log(email);

User.findOne({'email': email},function(err, user){
if(err){
    return res.status(500).json({"Message" :"Incorrect password", status:"false",code:"500"});
}
    console.log(user);
    return res.status(200).json({id :user._id, status:"true",code:"200"});
});

});

router.get('/getallcartitem', function(req, res, next) {
    Cart.find()
        .then(function(cartItems) {
            //res.render('index', {items: doc});
            res.status(200).json({items: cartItems, status : "true", code : "200" });
        });
});

router.post('/removeusercart', function(req, res, next) {
    Cart.findOneAndRemove({owner_user_id: req.body.customer_id}, function (err, count) {
        if (err) {
            console.log("Some Error Happened while matching owner ID");
            return res.status(500).json({"Message": err, status: "false", code: "500"});
        }
        else {
            return res.status(200).json({usercart: count, status: "true", code: "200"});
        }
    });

});

router.post('/getusercart', function(req, res, next) {
    Cart.count({owner_user_id: req.body.customer_id}, function (err, count) {
        if (err) {
            console.log("Some Error Happened while matching owner ID");
            return res.status(500).json({"Message": err, status: "false", code: "500"});
        }
        else {
            if (count > 0) {
                //document exists
                console.log("Get user cart");
                Cart.findOne({owner_user_id: req.body.customer_id}, function (err, usercart) {
                    if (err) {
                        console.log("Some Error Happened while fetching user cart");
                        return res.status(500).json({"Message": err, status: "false", code: "500"});
                    }
                    else {
                        console.log(usercart);


                        var cart = {
                            "CustomerId" : usercart.owner_user_id,
                            "ItemDetails" : JSON.stringify(usercart.products),
                            "Total" :  usercart.total_price
                        };
                        return res.status(200).json({usercart: cart, status: "true", code: "200"});
                    }
                });
            }
        }
    });
});


router.post('/additemtocart', function(req, res, next) {

    Cart.count({owner_user_id: req.body.customer_id}, function (err, count){
        if(err)
        {
            console.log("Some Error Happened while matching owner ID");
            return res.status(500).json({"Message": err, status : "false", code : "500" });
        }
        else {
            if (count > 0) {
                //document exists
                console.log("Update cart");

                Cart.count({ products: { $elemMatch : {product_id : req.body.product_id }}}, function (err, productCount) {
                    if(err)
                    {
                        console.log("Some Error Happened while matching product ID");
                        return res.status(500).json({"Message": err, status : "false", code : "500" });
                    }
                    else
                    {
                        if(productCount>0)
                        {
                            //update product quantity
                            var msg = "Same Product..update quantity";
                            console.log(msg);

                            var condition = {$and :
                                [
                                    {owner_user_id:req.body.customer_id},
                                    { products: { $elemMatch : {product_id : req.body.product_id }}}
                                ]};

                            var updateCol = {$inc: { "products.$.product_quantity": 1 , total_quantity: 1, total_price: req.body.price} };
                            Cart.update(condition, updateCol, {upsert: true}, function(err){
                                if(err)
                                {
                                    console.log("Some Error Happened while incrementing product quantity");
                                    return res.status(500).json({"Message": err, status : "false", code : "500" });
                                }
                                else {
                                    console.log("Quantity Updated");
                                    return res.status(200).json({"Message": "Same Product, quantity increased", status : "true", code : "200" });
                                }
                            });
                        }
                        else
                        {
                            //Add product element
                            var msg = "Different Product..add";
                            console.log(msg);

                            var newProduct = {
                                product_id: req.body.product_id,
                                product_name : req.body.name,
                                product_desc : req.body.des,
                                product_price : req.body.price,
                                product_quantity : 1
                            };

                            var condition = {owner_user_id:req.body.customer_id};
                            var updateCol = {
                                $push : { products : newProduct},
                                $inc: { total_quantity: 1, total_price: req.body.price}
                            };

                            Cart.update(condition, updateCol, {upsert: true}, function(err){
                                if(err)
                                {
                                    console.log("Some Error Happened while pushing new product");
                                    return res.status(500).json({"Message": err, status : "false", code : "500" });
                                }
                                else {
                                    console.log("Quantity Updated");
                                    return res.status(200).json({"Message": "Different Product, updated cart", status : "true", code : "200" });
                                }
                            });
                        }
                    }
                });
            }
            else {
                console.log("Insert cart");
                var item = {
                    owner_user_id : req.body.customer_id,
                    total_quantity: 1,
                    total_price: req.body.price,
                    products : [{
                        product_id: req.body.product_id,
                        product_name : req.body.name,
                        product_desc : req.body.des,
                        product_price : req.body.price,
                        product_quantity : 1
                    }]
                };

                var cartData = new Cart(item);
                cartData.save(function (err, product, numAffected) {
                    if (err)
                    {
                        console.log("Some Error Happened while Inserting into Cart");
                        return res.status(500).json({"Message": err, status : "false", code : "500" });
                    }
                    else
                    {
                        var msg = numAffected+" rows added into Cart\n"+product;
                        console.log(msg);
                        res.status(200).json({"Message": msg, status : "true", code : "200" });
                    }
                });
            }
        }
    });

});


router.post('/removeitemfromcart', function(req, res, next) {

    Cart.count({owner_user_id: req.body.customer_id}, function (err, count){
        if(err)
        {
            console.log("Some Error Happened while matching owner ID");
            return res.status(500).json({"Message": err, status : "false", code : "500" });
        }
        else {
            if (count > 0) {
                //document exists
                console.log("Update cart");
                Cart.count({ products: { $elemMatch : {product_id : req.body.product_id }}}, function (err, productCount) {
                    if(err)
                    {
                        console.log("Some Error Happened while matching product ID");
                        return res.status(500).json({"Message": err, status : "false", code : "500" });
                    }
                    else
                    {
                        if(productCount>0)
                        {
                            //update product quantity
                            var msg = "Same Product..reduce quantity";
                            console.log(msg);
                            Cart.count( {'products.product_quantity':1, 'products.product_id': req.body.product_id}, function (err, productArrCount) {
                                if(err)
                                {
                                    console.log("Some Error Happened while counting product id");
                                    return res.status(500).json({"Message": err, status : "false", code : "500" });
                                }
                                else
                                {
                                    if(productArrCount==1)
                                    {
                                        //Remove product element
                                        var msg = "Last Product..Remove";
                                        console.log(msg);

                                        var condition = {owner_user_id:req.body.customer_id};
                                        var updateCol = {
                                            $pull : { products : {product_id : req.body.product_id }},
                                            $inc: { total_quantity: -1, total_price: -req.body.price}
                                        };

                                        Cart.update(condition, updateCol, {upsert: true}, function(err){
                                            if(err)
                                            {
                                                console.log("Some Error Happened while reomving last product");
                                                return res.status(500).json({"Message": err, status : "false", code : "500" });
                                            }
                                            else {
                                                console.log("Quantity Updated");
                                                return res.status(200).json({"Message": "Last product...removed product array", status : "true", code : "200" });
                                            }
                                        });
                                    }

                                    else
                                    {
                                        //Reduce Quantity
                                        var condition = {$and :
                                            [
                                                {owner_user_id:req.body.customer_id},
                                                { products: { $elemMatch : {product_id : req.body.product_id }}}
                                            ]};

                                        var updateCol = {$inc: { "products.$.product_quantity": -1 , total_quantity: -1, total_price: -req.body.price} };
                                        Cart.update(condition, updateCol, {upsert: true}, function(err){
                                            if(err)
                                            {
                                                console.log("Some Error Happened while decrementing product quantity");
                                                return res.status(500).json({"Message": err, status : "false", code : "500" });
                                            }
                                            else {
                                                console.log("Quantity Updated");
                                                return res.status(200).json({"Message": "Same Product..quantity is reduced", status : "true", code : "200" });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else
                        {
                            var msg = "Item doesn't exist..!!";
                            console.log(msg);
                            res.status(500).json({"Message": msg, status : "false", code : "500" });
                        }
                    }
                });
            }
            else {
                var msg = "Cart doesn't exist..!!";
                console.log(msg);
                res.status(500).json({"Message": msg, status : "false", code : "500" });
            }
        }
    });
});


module.exports = router;
