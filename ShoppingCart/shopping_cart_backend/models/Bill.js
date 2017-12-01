var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bill = new Schema({
	
	bill_id: String,
	bill_date:Date,
	from_date:Date,
	to_date:Date,
	user_id : String,
	flights :
	[{
		flight_id : String,
		flight_start_date: Date,
		flight_end_date: Date,
		no_of_travelers : Number,
		amount: Number,
		Notes: String
	}],
	hotels :
	[{
		hotel_id : String,
		booking_start_date: Date,
		booking_end_date: Date,
		amount: Number,
		no_of_guests : Number,
		Notes: String
	}],
	cars :
	[{
		car_id : String,
		booking_start_date: Date,
		booking_end_date: Date,
		amount: Number,
		Notes: String
	}],
	bill_amount:Number,
	bill_status:String
});

module.exports = mongoose.model("Bill", Bill);