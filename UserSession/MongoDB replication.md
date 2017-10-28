#### Mongodb Replication

For User Sessions I will be using Mongodb as the database and here is how I will achieve my partition recovery incase one of the db's goes down.

- The Primary node receives all the write operations from the client and logs all the changes in the oplog and all the secondary replicas 
use this oplogs to replicate the primary changes.

- If the Primary dies then an internal voting is done to decide which replica will become the primary.

#### The representaion of the replication.

![Alt text](https://github.com/nguyensjsu/cmpe281-ninja/blob/master/UserSession/mongodb_replication.png)
