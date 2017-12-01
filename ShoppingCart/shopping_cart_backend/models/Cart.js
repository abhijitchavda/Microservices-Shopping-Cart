var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Cart = new Schema({
    cart_id : String,
    group_id : String,
    owner_user_id : String,
    members :
    [{
        member_user_id: String
    }],
    products :
    [{
        product_id :String,
        product_name : String,
        product_desc : String,
        product_price :Number,
        product_quantity : Number
    }],
    total_quantity :Number,
    total_price : Number,
    cart_status : String,
    cart_create_date : Date,
    cart_modified_date : Date
});

Cart.methods.isActive = function(cart) {
    console.log("checking if active:"+(cart.userstatus == "active"));
    return cart.userstatus == "active";
};
module.exports = mongoose.model("Cart", Cart);