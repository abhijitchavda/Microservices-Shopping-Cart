var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Listings = new Schema({
	listing_id: String,
	listing_type: String,
	listing_create_date: Date,
	listing_modified_date: Date,
	hotel:
	{
		hotel_id : String,
		hotel_name : String,
		address :
		{
			street: String,
			state: String,
			city:String,
			zip_code:String,
			country:String
		},
		stars : Number,
		rooms :
		[{
			room_id: String,
			room_type: String,
			room_price: Number,
			room_photos:
			[{
				room_photo_id: String
			}]
		}],
		avg_rating : Number,
		reviews :
		[{
			ratings : Number,
			feedback : String,
			user_id : String
		}]	
	},
	
	
	flight:
	{
		flight_id : String,
		flight_name : String,
		flight_operator_name : String,
		departure_date: Date,
		arrival_date: Date,
		origin: String,
		destination: String,
		classes:
		[{
			class_type: String,
			class_price: Number,
			no_of_seats_available: Number
		}]	
	},
	
	
	car:
	{
		car_id : String,
		car_name : String,
		car_type : String,
		model_name : String,
		specification :
		{
			color: String,
			engine_capacity: String,
			miles_used: Number
		},
		car_rental_price : Number	
	}
});

module.exports = mongoose.model("Listings", Listings);