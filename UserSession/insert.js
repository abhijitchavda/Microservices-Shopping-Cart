var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/login";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { password: "1234", email: "prathmesh272@outlook.com" };
  db.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});