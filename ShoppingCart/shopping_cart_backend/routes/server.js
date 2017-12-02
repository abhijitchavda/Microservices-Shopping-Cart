<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//mongoose.connect('localhost:27017/ninja');
//mongoose.connect('localhost:27017,localhost:27018,localhost:27019/ninja?replicaSet=shopping');
//mongoose.connect('13.56.179.55:27017, 13.57.12.172:27018, 52.53.176.18:27019/ninja?replicaSet=shopping');
mongoose.connect('13.56.194.186:27017, 13.56.159.30:27018, 13.56.227.70:27019/ninja?replicaSet=shopping');


var Schema = mongoose.Schema;
var Cart = require('../models/Cart')


router.get('/', function(req, res, next) {
    res.status(200).render('index');
});


router.get('/ping', function(req, res, next) {
    res.status(200).json({'Application Name' : 'Shopping Cart API', status : "true", code : "200" });
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
                            "ItemDetails" : usercart.products,
                            "Total" :  usercart.total_price
                        };
                        return res.status(200).json({usercart: cart, status: "true", code: "200"});
                    }
                });
            }
        }
    });
});

router.post('/getusercartdetails', function(req, res, next) {
    console.log("Inside user cart");
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
                        return res.status(200).json({usercart: usercart, status: "true", code: "200"});
                    }
                });
            }
        }
    });
});


router.post('/additemtocart', function(req, res, next) {
    console.log(req.body);

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
                            Cart.update(condition, updateCol, false, function(err){
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

                            Cart.update(condition, updateCol, false, function(err){
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
                        //res.status(200).json({"Message": msg, status : "true", code : "200" });
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

                                        Cart.update(condition, updateCol, false, function(err){
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
                                        Cart.update(condition, updateCol, false, function(err){
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


process.on('uncaughtException', function (err) {
    console.log('Caught exception: error to connect mongodb' + err);

});

=======
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//mongoose.connect('localhost:27017/ninja');
//mongoose.connect('localhost:27017,localhost:27018,localhost:27019/ninja?replicaSet=shopping');
//mongoose.connect('13.56.179.55:27017, 13.57.12.172:27018, 52.53.176.18:27019/ninja?replicaSet=shopping');
mongoose.connect('13.56.194.186:27017, 13.56.159.30:27018, 13.56.227.70:27019/ninja?replicaSet=shopping');


var Schema = mongoose.Schema;
var Cart = require('../models/Cart')


router.get('/', function(req, res, next) {
    res.status(200).render('index');
});


router.get('/ping', function(req, res, next) {
    res.status(200).json({'Application Name' : 'Shopping Cart API', status : "true", code : "200" });
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
                            "ItemDetails" : usercart.products,
                            "Total" :  usercart.total_price
                        };
                        return res.status(200).json({usercart: cart, status: "true", code: "200"});
                    }
                });
            }
        }
    });
});

router.post('/getusercartdetails', function(req, res, next) {
    console.log("Inside user cart");
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
                        return res.status(200).json({usercart: usercart, status: "true", code: "200"});
                    }
                });
            }
        }
    });
});


router.post('/additemtocart', function(req, res, next) {
    console.log(req.body);

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
                            Cart.update(condition, updateCol, false, function(err){
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

                            Cart.update(condition, updateCol, false, function(err){
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
                        //res.status(200).json({"Message": msg, status : "true", code : "200" });
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

                                        Cart.update(condition, updateCol, false, function(err){
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
                                        Cart.update(condition, updateCol, false, function(err){
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


process.on('uncaughtException', function (err) {
    console.log('Caught exception: error to connect mongodb' + err);

});

>>>>>>> e80abb1c1f3f0146f22b44af9bff352e6cbc65fa
module.exports = router;