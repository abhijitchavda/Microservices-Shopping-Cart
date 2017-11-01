Replicset for product catalog consist of 3 nodes, one primary and two secondary. Nodejs server will be communication to this replicaset cluster. The read and write operations will be performed on PRIMARY node and then all three nodes will be synced automatically by the replicaset.

The commands to set up the replicaset can be found in replicaset_setup_locally and the db content of one of the replicaset can be found in db/replicaset
