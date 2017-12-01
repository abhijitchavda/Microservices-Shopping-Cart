var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/ninja');
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

router.post('/additemtocart', function(req, res, next) {


    Cart.count({owner_user_id: req.body.owner_user_id}, function (err, count){
        if(err)
        {
            console.log("Some Error Happened while matching owner ID");
            return res.status(500).json({"Message": err, status : "false", code : "500" });
        }
        else {
            if (count > 0) {
                //document exists
                console.log("Update cart");

                Cart.count({ products: { $elemMatch : {product_id : req.body.products[0].product_id }}}, function (err, productCount) {
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
                                    {owner_user_id:req.body.owner_user_id},
                                    { products: { $elemMatch : {product_id : req.body.products[0].product_id }}}
                                ]};

                            var updateCol = {$inc: { "products.$.product_quantity": 1 , total_quantity: 1, total_price: req.body.products[0].product_price} };
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
                                product_id: req.body.products[0].product_id,
                                product_name : req.body.products[0].product_name,
                                product_desc : req.body.products[0].product_desc,
                                product_price : req.body.products[0].product_price,
                                product_quantity : req.body.products[0].product_quantity
                            };

                            var condition = {owner_user_id:req.body.owner_user_id};
                            var updateCol = {
                                $push : { products : newProduct},
                                $inc: { total_quantity: 1, total_price: req.body.products[0].product_price}
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
                    owner_user_id : req.body.owner_user_id,
                    total_quantity: req.body.total_quantity,
                    total_price: req.body.total_price,
                    products : [{
                        product_id: req.body.products[0].product_id,
                        product_name : req.body.products[0].product_name,
                        product_desc : req.body.products[0].product_desc,
                        product_price : req.body.products[0].product_price,
                        product_quantity : req.body.products[0].product_quantity
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

    Cart.count({owner_user_id: req.body.owner_user_id}, function (err, count){
        if(err)
        {
            console.log("Some Error Happened while matching owner ID");
            return res.status(500).json({"Message": err, status : "false", code : "500" });
        }
        else {
            if (count > 0) {
                //document exists
                console.log("Update cart");
                Cart.count({ products: { $elemMatch : {product_id : req.body.products[0].product_id }}}, function (err, productCount) {
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
                            Cart.count( {'products.product_quantity':1, 'products.product_id': req.body.products[0].product_id}, function (err, productArrCount) {
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

                                        var condition = {owner_user_id:req.body.owner_user_id};
                                        var updateCol = {
                                            $pull : { products : {product_id : req.body.products[0].product_id }},
                                            $inc: { total_quantity: -1, total_price: -req.body.products[0].product_price}
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
                                                {owner_user_id:req.body.owner_user_id},
                                                { products: { $elemMatch : {product_id : req.body.products[0].product_id }}}
                                            ]};

                                        var updateCol = {$inc: { "products.$.product_quantity": -1 , total_quantity: -1, total_price: -req.body.products[0].product_price} };
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