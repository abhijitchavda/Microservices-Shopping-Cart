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
##### Using RabbitMQ

##### Using Kafka 

##### Using Kong add-ons.
  
#### Additional features.
- [ ] Dashboard for logs.
- [ ] DB cluster must be able to support recommendation engine.
 
