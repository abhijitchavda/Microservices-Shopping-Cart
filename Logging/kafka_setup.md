##### Installation and startup

1. Install JDK.

  > $sudo apt-get install openjdk-8-jdk

  find installation path command: readlink -f $(which java)

  Set JAVA_HOME
  > export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

  Set PATH
  > export PATH=$PATH:/usr/lib/jvm/java-8-openjdk-amd64/bin


2. Install Apache Kafka.


3. Start Zookeper server.
  > $ bin/zookeeper-server-start.sh config/zookeeper.properties


4. Start Kafka server.
  > $bin/kafka-server-start.sh config/server.properties




##### Creation and listing of Topics.

Creating a test topic
> bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic nevtest

Listing a topic
> bin/kafka-topics.sh --list --zookeeper localhost:2181


##### Sending and receiving msgs.

Create a producer

> bin/kafka-console-producer.sh --broker-list localhost:9092 --topic nevtest

Create a consumer

> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic nevtest --from-beginning


To see it in action enter the messages in the producer terminal to see it in the messages in consumer terminal.

