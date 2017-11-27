package main
/*
The payment structure specifies the data added to the payment collection in MongoDB
*/
import (	
    "gopkg.in/mgo.v2/bson"
    "gopkg.in/mgo.v2"
)

type order struct{
	Id         bson.ObjectId `bson:"_id,omitempty" json:"id"`
	OrderId		string		`bson:"orderId" json:"orderId"`
	CustomerId 	string 	`bson:"customerId" json:"customerId"`
	ItemDetails map[string]map[string]float32 `bson:"ItemDetails" json:"ItemDetails"`
	Total 		float32 `bson:"total" json:"total"`
	Status 		string	`bson:"status" json:"status"`
	Timestamp 	string	`bson:"timestamp" json:"timestamp"`
	DeliveryAddress string `bson:"deliveryAddress" json:"deliveryAddress"`
}

type MongoWriter struct {
    sess *mgo.Session
}

var mw *MongoWriter
var Order_channel chan order