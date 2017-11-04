var avro = require('avsc');

var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;

//Create the Avro schema (MyAwesomeType) for three fields id , timestamp, enumField.
/*
var avroSchema = {
   name: 'MyAwesomeType',
   type: 'record',
   fields: [
     {
       name: 'id',
       type: 'string'
     }, {
       name: 'timestamp',
       type: 'double'
     }, {
       name: 'enumField',
       type: {
         name: 'EnumField',
         type: 'enum',
         symbols: ['sym1', 'sym2', 'sym3']
       }
     }]
 };
*/

var avroSchema = {
   name: 'usersInfo',
   type: 'record',
   "fields" : [{"name" : "name",
                "type" : "string",
               },

                {"name" : "email",
                "type" : "string",
                },

                {"name" : "username",
                "type" : "string",
                },

                {"name" : "password",
                "type" : "string",
                }]
              };
              
//Creating a avro type from the schema
var type = avro.parse(avroSchema);

//Creating a client.
var client = new Client('localhost:2181');
var topics = [{
  //topic: 'node-test'
  topic: 'signup_response'
}];


//Creating the consumer to consume messages.
var options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: 'buffer'
};
var consumer = new HighLevelConsumer(client, topics, options);

consumer.on('message', function(message) {
  var buf = new Buffer(message.value, 'binary'); // Read string into a buffer.
  var decodedMessage = type.fromBuffer(buf.slice(0)); // Skip prefix.
  console.log(decodedMessage);
});

consumer.on('error', function(err) {
  console.log('error', err);
});

process.on('SIGINT', function() {
  consumer.close(true, function() {
    process.exit();
  });
});
