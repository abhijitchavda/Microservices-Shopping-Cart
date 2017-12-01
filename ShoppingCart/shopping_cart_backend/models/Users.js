var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Users = new Schema({
	user_id : String,
	first_name: String,
	middle_name: String,
	last_name : String,
	email: String,
	birth_date : Date,
	password : String,
	gender : String,
	home_airport : String,
	email_site: String,
	isEmailVerified: Boolean,
	address :
	{
		street: String,
		state: String,
		city:String,
		zip_code:String,
		country:String
	},
	phone : Number,
	social_connections:
	{
		isFacebookLinked: Boolean, 
		isGoogleLinked: Boolean
	},
	Travelers :
		[{
			first_name: String,
			middle_name: String,
			last_name : String,
			email: String,
			phone : Number,
			reward_programs: 
			[{
				program_name: String
			}]
		}],
	trips : 
	[{
		trip_id: String
	}],
	
	carddetails : {
		credit_card : Number,
		first_name : String,
		last_name : String,
		cvv : Number,
		expiry_month : Number,
		expiry_year : Number,
		zip_code : Number,
		country : String
	},
	profile_pic :  String,
	video :  String,
	user_type : String,
	user_status : String,
	avg_rating : Number,
	reviews :
	[{
		ratings : Number,
		feedback : String,
		trip_id: String,
		user_id : String
	}]	 
});

Users.methods.isActive = function(user) {
	console.log("checking if active:"+(user.userstatus == "active"));
	return user.userstatus == "active";
};
module.exports = mongoose.model("Users",Users);