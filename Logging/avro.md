#### Apache Avro and the need for schemas.

What is the need for avro ?
[here](https://www.confluent.io/blog/avro-kafka-data/)
[here](https://www.oreilly.com/ideas/the-problem-of-managing-schemas)
[here](http://martin.kleppmann.com/2012/12/05/schema-evolution-in-avro-protocol-buffers-thrift.html)


an event that represents the sale of a product might look like this:
> {
    "time": 1424849130111,
    "customer_id": 1234,
    "product_id": 5678,
    "quantity":3,
    "payment_type": "mastercard"
  }


It might have a schema like this that defines these five fields:

> {
    "type": "record",
    "doc":"This event records the sale of a product",
    "name": "ProductSaleEvent",
    "fields" : [
      {"name":"time", "type":"long", "doc":"The time of the purchase"},
      {"name":"customer_id", "type":"long", "doc":"The customer"},
      {"name":"product_id", "type":"long", "doc":"The product"},
      {"name":"quantity", "type":"int"},
      {"name":"payment",
       "type":{"type":"enum",
  	     "name":"payment_types",
               "symbols":["cash","mastercard","visa"]},
       "doc":"The method of payment"}
    ]
  }


A schema like the above will be associated with each Kafka topic. You can think of the schema much like the schema of a relational database table, giving the requirements for data that is produced into the topic as well as giving instructions on how to interpret data read from the topic.


The schemas end up serving a number of critical purposes:

- They let the producers or consumers of data streams know the right fields are need in an event and what type each field is.
- They document the usage of the event and the meaning of each field in the “doc” fields.
- They protect downstream data consumers from malformed data, as only valid data will be permitted in the topic.


Linkedin put this idea of schemafied event data into practice at large scale. User activity events, metrics data, stream processing output, data computed in Hadoop, and database changes were all represented as streams of Avro events.
