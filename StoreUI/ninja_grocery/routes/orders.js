var express = require('express');
var router = express.Router();
var Request = require('request');

/* GET users listing. */
router.get('/', isLoggedIn,function(req, res, next) {
	
	
	var userId = req.session.passport.user;
	Request.get('http://localhost:4000/order/'+userId, function (error, response, body) {
 	        if (error) {
                throw error;
            }
 
            order_data = JSON.parse(body);
            console.log(order_data);
            if(order_data == null){
            	console.log(userId+" has no orders.");
            	res.render('shop/orders', { title: 'Orders', orders:order_data, valid_user:true, hasOrder:false});
            }
            else{
            	console.log("Orders exist");
            	orderList=[];
            	for(var i=0;i< order_data.length;i +=1){
	            	console.log("Order: "+i);
	            	console.log(JSON.stringify(order_data[i]["ItemDetails"]));
	            	var items = ""
	            	for(var j in order_data[i]["ItemDetails"]){
	            			//console.log("Item: "+j+"\nPrice: "+order_data[i]["ItemDetails"][j]["Price"]+"\nQuantity: "+order_data[i]["ItemDetails"][j]["Qty"]+"\n");
	            			items = items+"Item: "+j+"<br>Price: "+order_data[i]["ItemDetails"][j]["Price"]+"<br>Quantity: "+order_data[i]["ItemDetails"][j]["Qty"]+"<br><br>";
	            			//console.log(order_data[i]["ItemDetails"][j].stringify());
	            			//order_data[i]["ItemDetails"] = order_data[i]["ItemDetails"][j].
	            	}
	            	console.log(items);
	            	order_data[i]["ItemDetails"] = items;
	            	//order_data[i]["ItemDetails"] = JSON.stringify(order_data[i]["ItemDetails"]);

	            	
	            	//console.log(order_data[i]["orderId"]);
            	}
            	res.render('shop/orders', { title: 'Orders', orders:order_data, valid_user:true, hasOrder:true});
            }
            
            //res.render('shop/index', { title: 'ninja ',products: productChunks});

});
    //} //End of if
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/user/signin')
}

module.exports = router;
