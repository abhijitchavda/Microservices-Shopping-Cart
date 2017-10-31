#### Brief

In our shopping cart application it is important to have a centralized logging system that will store logs from the various sub modules and can be used for troubleshooting, analytics or recommendation engine.

#### Requirement
- [ ] General logging api.
- [ ] Api for reporting and analytics.
- [ ] Api for error logs.
  - [ ] Api for error logs from shopping cart module.
  - [ ] Api for error logs from payments module.
  - [ ] Api for error logs from product catalog module.
  - [ ] Api for error logs from user management module.


#### System Options
- RabbitMQ messaging queue.
- Kafka cluster.
- Kong api gateway inbuilt messaging system.


#### Architecture

![Log module arch](https://github.com/nguyensjsu/cmpe281-ninja/blob/master/Logging/Logging%20arch.png "Logging subsystem")

##### Using RabbitMQ

##### Using Kafka 

![Log module using Kafka cluster](https://github.com/nguyensjsu/cmpe281-ninja/blob/master/Logging/Kafka_architecture_v0.1.png "Handling application events using Kafka")

In this architecture we use Kafka to handle the streams of data produced by our shopping cart application. Every node api will write to the respective topic and this stream of data can be consumed by consumers for further processing , analysis , archiving and reporting.

##### Using Kong add-ons.
  
#### Additional features.
- [ ] Dashboard for logs.
- [ ] DB cluster must be able to support recommendation engine.
 
