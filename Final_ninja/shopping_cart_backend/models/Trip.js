var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Trip = new Schema({
	trip_id : String,
	trip_name : String,
	user_id : String,
	user_email : String,
	bill : {
		bill_id: String,
		bill_amount : Number
	},	
	trip_start_date : Date,
	trip_end_date : Date,
	notes : String, 
	Reviews : [{
		ratings : Number, 
		feedback : String,
		photos :
		[{ 
			photo_id: String
		}],
	}]
});
module.exports = mongoose.model("Trip",Trip);