package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
	"github.com/codegangsta/negroni"
	//"github.com/streadway/amqp"
	"github.com/gorilla/mux"
	"github.com/unrolled/render"
	//"github.com/satori/go.uuid"
	"gopkg.in/mgo.v2"
    "gopkg.in/mgo.v2/bson"
    "time"
)

/* 

Variable declaration and initialization

*/

// MongoDB Configuration

//Local DB payment configuration 

var mongodb_server = "localhost:27015"
var mongodb_database = "orders"
var mongodb_collection = "order"

//Local DB payment log configuration 

var mongodb_log_server = "localhost:27015"
var mongodb_log_database = "log"
var mongodb_log_collection = "orders"

//DB payment configuration 

//var mongodb_server = "mongodb://54.153.119.128,52.53.219.137,52.53.240.155/ninjacart?replicaSet=mongo-replica-set"
//var mongodb_database = "ninjacart"
//var mongodb_collection = "orders"

//DB payment log configuration 

//var mongodb_log_server = "localhost:27015"
//var mongodb_log_database = "log"
//var mongodb_log_collection = "orders"

/*
Function is used to initialize parameters and create a session for logger DB
*/
func init(){

	fmt.Println("Initializing...")

	// Create channel to hold order object
	Order_channel=make(chan order,10)

	//Code to create DB writer workers
	fmt.Println("Starting write workers..")
	for i:=0; i<4; i++{
		fmt.Println("Worker ",i+1,": Started")
		go writerWorker()
	} 

	//Code to create a session to the logging module DB
	sess,err := mgo.Dial(mongodb_log_server)
	if(err!=nil){
		fmt.Println("Unable to connect to logger DB..Proceeding without logging to Logger sub-module")
	}else{
		mw = &MongoWriter{sess}
		log.SetOutput(mw)
	}

	//Start orderProcessor as a Go Routine to process orders
	go orderProcessor()

}

/*
Log Writer implementation to write logs to Logging module
*/
func (mw *MongoWriter) Write(p []byte) (n int, err error) {
    c := mw.sess.DB(mongodb_log_database).C(mongodb_log_collection)
    err = c.Insert(bson.M{
        "created": time.Now(),
        "msg":     string(p),
    })
    if err != nil {
        return
    }
    return len(p), nil
}

/* 
NewServer configures and returns a Server.
*/
func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.UseHandler(mx)
	fmt.Println("Started order server...")
	return n
}

// This funtion checks the database and updates the order status every 30 seconds
func orderProcessor(){
	var status string

	session, err := mgo.Dial(mongodb_server)
	for;;{
		// Connects to MongoDB
        if err != nil {
        	fmt.Println("Orders API - orderProcessing - Unable to connect to MongoDB during read operation")
                panic(err)
        }
        session.SetMode(mgo.Monotonic, true)
        c := session.DB(mongodb_database).C(mongodb_collection)
        var result []bson.M
		err = c.Find(nil).All(&result)
		if err != nil {
                fmt.Println("Orders API - orderProcessing - Error reading data from MongoDB")
        }
        for i:=0;i<len(result);i++{
        	if(result[i]["status"] != "Delivered"){
        	//fmt.Println("\n\nOrder ID being updated is:\n", result[i]["orderId"])
        	switch result[i]["status"] {
        	case "Order Placed": status = "Order Processed"
        	case "Order Processed": status = "Shipped"
        	case "Shipped": status = "Delivered"
        	}

        	//fmt.Println("Order ID: ",result[i]["orderId"]," Updated Status: ",result[i]["status"],"\n\n")
        	//Update MongoDB with the new status
        	//fmt.Println(result[i])
        	query := bson.M{"orderId" : result[i]["orderId"]}
        	change := bson.M{"$set": bson.M{ "status" : status}}
        	err = c.Update(query, change)
        	timer1 := time.NewTimer(time.Second * 5)
			<-timer1.C
		}
        }
	}
        defer session.Close()
}

/*
Function that binds handlers for API routes
*/
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/order/{customer_id}", orderHandler(formatter)).Methods("GET")
	mx.HandleFunc("/order", newOrderHandler(formatter)).Methods("POST")
	mx.HandleFunc("/ping", ping(formatter)).Methods("GET")
}

/*
Function to provide API healthcheck - ping 
*/
func ping(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		fmt.Println("Ping - Payment API running");
		result := "Orders API - Running"
		log.Println("Test ping log"+",hi")
		formatter.JSON(w, http.StatusOK, result);
	}
}

/*
Function that handles GET request and displays the order information based on the customerID
*/
func orderHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// Connects to MongoDB
		session, err := mgo.Dial(mongodb_server)
        if err != nil {
        	fmt.Println("Orders API - Unable to connect to MongoDB during read operation")
                panic(err)
        }
        defer session.Close()
        session.SetMode(mgo.Monotonic, true)
        c := session.DB(mongodb_database).C(mongodb_collection)
        params := mux.Vars(req)
        var customer_id string = params["customer_id"]
        fmt.Println(customer_id)
        var result []bson.M
		err = c.Find(bson.M{"customerId" : customer_id}).All(&result)
		if err != nil {
                log.Fatal(mux.Vars(req))
        }

        fmt.Println("Orders are:\n", result)
        log.Println("Test log")
		formatter.JSON(w, http.StatusOK, result)

	}
}
/*
Function that handles POST request and writes the order object to the Order Channel
*/
func newOrderHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var data order
		err := json.NewDecoder(req.Body).Decode(&data)
		if err!=nil{
			fmt.Println("Orders API - Unable to obtain request body")
			panic(err)
		}
		go workerHandler(data,Order_channel)
		formatter.JSON(w, http.StatusOK, data)
	}
}
/*
Function to wrtie to Order channel
*/
func workerHandler(data order, Order_channel chan order){
	Order_channel<-data
}
/*
Worker function that write Order object from the Order Channel to MongoDB
*/
func writerWorker(){

	for i:=0;;i++{
		order_value:=<-Order_channel
		session, err := mgo.Dial(mongodb_server)
        if err != nil {
        	fmt.Println("Orders API - Unable to connect to MongoDB during write operation")
                panic(err)
        }
        defer session.Close()
        session.SetMode(mgo.Monotonic, true)
        c := session.DB(mongodb_database).C(mongodb_collection)
		c.Insert(order_value)

	}
}



