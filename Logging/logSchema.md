#### Log structure

The following fields will be stored as a part of the logs.

1. Userid/Session id.
2. Username.
3. Timestamp in UTC format.
4. message.


There will be a separate collection based on the modules in the application. For example:
the payments module will log the following data into the payments collection.
  >{
      "_id" : ObjectId("5a1124903d0c6727aa42d3a2"),
      "timestamp" : ISODate("2017-11-19T06:28:32.257Z"),
      "userid" : "ninja",
      "orderid" : "N12190434",
      "message" : "Error info",
      "metadata" : {}
  }
