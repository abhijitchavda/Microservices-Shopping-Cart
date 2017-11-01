package main
/*
The payment structure specifies the data added to the payment collection in MongoDB
*/
import (	
    "gopkg.in/mgo.v2/bson"
)
type payment struct{
	Id         bson.ObjectId `bson:"_id,omitempty" json:"id"`
	OrderId		string		`bson:"orderId" json:"orderId"`
	CustomerId 	string 	`bson:"customerId" json:"customerId"`
	Total 		float32 `bson:"total" json:"total"`
	Timestamp 	string	`bson:"timestamp" json:"timestamp"`
}