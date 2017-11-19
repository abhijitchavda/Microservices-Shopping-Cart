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
)

var (
    Trace   *log.Logger
    Info    *log.Logger
    Warning *log.Logger
    Error   *log.Logger
)

// MongoDB Config
var mongodb_server = "localhost:27015"
var mongodb_database = "payments"
var mongodb_collection = "payment"
// RabbitMQ Config
/*var rabbitmq_server = "rabbitmq"
var rabbitmq_port = "5672"
var rabbitmq_queue = "gumball"
var rabbitmq_user = "guest"
var rabbitmq_pass = "guest"*/

// NewServer configures and returns a Server.
func NewServer() *negroni.Negroni {
	formatter := render.New(render.Options{
		IndentJSON: true,
	})
	n := negroni.Classic()
	mx := mux.NewRouter()
	initRoutes(mx, formatter)
	n.UseHandler(mx)
	return n
}

func init(){
	//Code to create workers 
	fmt.Println("Started server...")
	Payment_channel=make(chan payment,10)
	go writerWorker()
	//for i:=0; i<4; i++{
		//go workerHandler()
	//} 

	//Create updater worker
}

// API Routes
func initRoutes(mx *mux.Router, formatter *render.Render) {
	mx.HandleFunc("/payment/{order_id}", paymentHandler(formatter)).Methods("GET")
	mx.HandleFunc("/payment", newPaymentHandler(formatter)).Methods("POST")
	mx.HandleFunc("/ping", ping(formatter)).Methods("GET")
}
/*
// Helper Functions
func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
		panic(fmt.Sprintf("%s: %s", msg, err))
	}
}*/


// API Ping Handler
func ping(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		fmt.Println("Ping - Payment API running");
		result := "Payment API - Running"
		formatter.JSON(w, http.StatusOK, result);
	}
}

func paymentHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		//formatter.JSON(w, http.StatusOK, struct{ Test string }{"API version 1.0 alive!"})
		// Connects to MongoDB
		session, err := mgo.Dial(mongodb_server)
        if err != nil {
        		Error.Println("Payments API - Unable to connect to MongoDB during read operation")
                panic(err)
        }
        defer session.Close()
        session.SetMode(mgo.Monotonic, true)
        c := session.DB(mongodb_database).C(mongodb_collection)
        params := mux.Vars(req)
        var order_id string = params["order_id"]
        fmt.Println("Fetching order#: ",order_id)
        var result bson.M
		err = c.Find(bson.M{"orderId" : order_id}).One(&result)
		if err != nil {
                log.Fatal(mux.Vars(req))
        }
        fmt.Println("Payment made is:", result)
		formatter.JSON(w, http.StatusOK, result)

	}
}

func newPaymentHandler(formatter *render.Render) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var data payment
		err := json.NewDecoder(req.Body).Decode(&data)
		if err!=nil{
			Error.Println("Payments API - Unable to obtain request body")
			panic(err)
		}
		/*session, err := mgo.Dial(mongodb_server)
        if err != nil {
                panic(err)
        }
        defer session.Close()
        session.SetMode(mgo.Monotonic, true)
        c := session.DB(mongodb_database).C(mongodb_collection)
		c.Insert(data)*/
		go workerHandler(data,Payment_channel)
		formatter.JSON(w, http.StatusOK, data)
	}

	/*

	Sample payment write:

	URL: http://localhost:3000/payment

	Object:

	{"OrderId" : "1234",	
	"CustomerId" : "Sam", 	
	"Total" : 32.5, 
	"Timestamp" : "20170202"}
	*/
}

func workerHandler(data payment,Payment_channel chan payment) {
	Payment_channel<-data
	//Worker tasks
	//Write to channel
}
func writerWorker(){

	for i:=0;;i++{
		payment_value:=<-Payment_channel
		session, err := mgo.Dial(mongodb_server)
        if err != nil {
        		Error.Println("Payments API - Unable to connect to MongoDB during write operation")
                panic(err)
        }
        defer session.Close()
        session.SetMode(mgo.Monotonic, true)
        c := session.DB(mongodb_database).C(mongodb_collection)
		c.Insert(payment_value)

	}
}

