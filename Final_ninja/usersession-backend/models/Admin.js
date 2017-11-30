var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Admin = new Schema({
	admin_id : String,
	usertype : String,
	firstname: String,
	middlename: String,
	lastname : String,
	gender : String,
	email: String,
	isEmailVerified: Boolean,
	password : String,
	address : 
	{
		street: String,
		state: String,
		city:String,
		zipcode:String,
		country:String
	},
	phone : Number,
	userstatus : String
});

Admin.methods.isActive = function(admin) {
	console.log("checking if active:"+(admin.userstatus == "active"));
	return admin.userstatus == "active";
};

module.exports = mongoose.model("Admin", Admin);