package main
/*
The payment structure specifies the data added to the payment collection in MongoDB
*/
type payment struct{
	Id         bson.ObjectId `bson:"_id,omitempty" json:"id"`
	OrderId		int		`json:"order_id" bson:"order_id"`
	CustomerId 	string 	`json:"customerId"`
	Total 		float32 `json:"total"`
	Timestamp 	string	`json:"timestamp"`
}